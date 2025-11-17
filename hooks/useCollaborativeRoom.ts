'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { db } from '@/lib/firebase'
import { doc, onSnapshot, updateDoc, serverTimestamp, setDoc, arrayUnion, arrayRemove, getDoc, deleteDoc } from 'firebase/firestore'

interface ConnectedUser {
  id: string
  name: string
}

interface UserCursor {
  userId: string
  userName: string
  cursorPosition: number
  relativeX: number
  relativeY: number
  lastUpdated: number
}

export function useCollaborativeRoom(roomId: string, userId: string, userName: string) {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userCursors, setUserCursors] = useState<Map<string, UserCursor>>(new Map())
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cursorTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pendingUpdatesRef = useRef<{ content?: string; title?: string }>({})
  const lastRemoteUpdateRef = useRef<{ content?: string; title?: string }>({})
  const isApplyingRemoteUpdateRef = useRef(false)
  const lastUserEditTimeRef = useRef<{ content: number; title: number }>({ content: 0, title: 0 })

  // Initialize Firestore listener
  useEffect(() => {
    const roomRef = doc(db, 'collaborativeRooms', roomId)

    // Add user to connected users
    const addUser = async () => {
      try {
        await updateDoc(roomRef, {
          connectedUsers: arrayUnion({ id: userId, name: userName }),
          updatedAt: serverTimestamp(),
        })
      } catch (err) {
        console.error('Failed to add user:', err)
      }
    }

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()
          const now = Date.now()

          // Only update if this isn't a pending change we're still waiting to sync
          isApplyingRemoteUpdateRef.current = true

          // Debounce remote updates: if user edited content within last 300ms, don't apply remote update
          if (pendingUpdatesRef.current.content === undefined &&
              (now - lastUserEditTimeRef.current.content) > 300) {
            setContent(data.content || '')
            lastRemoteUpdateRef.current.content = data.content || ''
          }

          // Same for title
          if (pendingUpdatesRef.current.title === undefined &&
              (now - lastUserEditTimeRef.current.title) > 300) {
            setTitle(data.title || '')
            lastRemoteUpdateRef.current.title = data.title || ''
          }

          setConnectedUsers(data.connectedUsers || [])

          // Update user cursors
          if (data.userCursors) {
            const cursorsMap = new Map<string, UserCursor>()
            for (const [key, cursor] of Object.entries(data.userCursors || {})) {
              if (typeof cursor === 'object' && cursor !== null && 'userId' in cursor && 'cursorPosition' in cursor) {
                cursorsMap.set(key, cursor as UserCursor)
              }
            }
            setUserCursors(cursorsMap)
          }

          setIsConnected(true)
          setError(null)

          isApplyingRemoteUpdateRef.current = false
        } else {
          setError('Room not found')
        }
      },
      (err) => {
        console.error('Firestore error:', err)
        setError('Failed to connect to room')
        setIsConnected(false)
      }
    )

    addUser()
    unsubscribeRef.current = unsubscribe

    return () => {
      // Remove user from connected users and clear cursor on unmount
      const removeUser = async () => {
        try {
          await updateDoc(roomRef, {
            connectedUsers: arrayRemove({ id: userId, name: userName }),
            [`userCursors.${userId}`]: null,
            updatedAt: serverTimestamp(),
          })

          // Delete room if now empty
          const roomSnapshot = await getDoc(roomRef)
          if (roomSnapshot.exists()) {
            const roomData = roomSnapshot.data()
            const connectedUsers = roomData.connectedUsers || []
            if (connectedUsers.length === 0) {
              await deleteDoc(roomRef)
            }
          }
        } catch (err) {
          console.error('Failed to remove user:', err)
        }
      }
      removeUser()
      unsubscribe()
    }
  }, [roomId, userId, userName])

  const updateContent = useCallback(
    (newContent: string) => {
      // Track user edit time to prevent remote updates from interrupting
      lastUserEditTimeRef.current.content = Date.now()

      // Optimistic update: show change immediately in UI
      setContent(newContent)
      pendingUpdatesRef.current.content = newContent

      // Clear any existing debounce timer
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      // Faster debounce: 150ms instead of 500ms for snappier feel
      updateTimeoutRef.current = setTimeout(async () => {
        try {
          const roomRef = doc(db, 'collaborativeRooms', roomId)
          await updateDoc(roomRef, {
            content: newContent,
            updatedAt: serverTimestamp(),
          })
          // Clear pending flag once sync completes
          pendingUpdatesRef.current.content = undefined
        } catch (err) {
          console.error('Failed to update content:', err)
        }
      }, 150)
    },
    [roomId]
  )

  const updateTitle = useCallback(
    (newTitle: string) => {
      // Track user edit time to prevent remote updates from interrupting
      lastUserEditTimeRef.current.title = Date.now()

      // Optimistic update: show change immediately in UI
      setTitle(newTitle)
      pendingUpdatesRef.current.title = newTitle

      // Clear any existing debounce timer
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      // Faster debounce: 150ms instead of 500ms for snappier feel
      updateTimeoutRef.current = setTimeout(async () => {
        try {
          const roomRef = doc(db, 'collaborativeRooms', roomId)
          await updateDoc(roomRef, {
            title: newTitle,
            updatedAt: serverTimestamp(),
          })
          // Clear pending flag once sync completes
          pendingUpdatesRef.current.title = undefined
        } catch (err) {
          console.error('Failed to update title:', err)
        }
      }, 150)
    },
    [roomId]
  )

  const updateCursorPosition = useCallback(
    (position: number, relativeX: number, relativeY: number) => {
      const roomRef = doc(db, 'collaborativeRooms', roomId)

      // Clear existing timeout
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current)
      }

      // Debounce cursor updates: 100ms for responsive feel
      cursorTimeoutRef.current = setTimeout(async () => {
        try {
          const cursorData: Record<string, any> = {}
          cursorData[`userCursors.${userId}`] = {
            userId,
            userName,
            cursorPosition: position,
            relativeX,
            relativeY,
            lastUpdated: Date.now(),
          }

          await updateDoc(roomRef, cursorData)
        } catch (err) {
          console.error('Failed to update cursor position:', err)
        }
      }, 100)
    },
    [roomId, userId, userName]
  )

  const leaveRoom = useCallback(async () => {
    try {
      const roomRef = doc(db, 'collaborativeRooms', roomId)

      // Remove user from connected users and clear their cursor
      await updateDoc(roomRef, {
        connectedUsers: arrayRemove({ id: userId, name: userName }),
        [`userCursors.${userId}`]: null,
        updatedAt: serverTimestamp(),
      })

      // Check if room is now empty and delete it
      const roomSnapshot = await getDoc(roomRef)
      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data()
        const connectedUsers = roomData.connectedUsers || []
        if (connectedUsers.length === 0) {
          // Delete the room if no users are connected
          await deleteDoc(roomRef)
        }
      }
    } catch (err) {
      console.error('Error leaving room:', err)
    }

    if (unsubscribeRef.current) {
      unsubscribeRef.current()
    }
  }, [roomId, userId, userName])

  return {
    content,
    title,
    updateContent,
    updateTitle,
    updateCursorPosition,
    connectedUsers,
    isConnected,
    error,
    leaveRoom,
    userCursors,
  }
}
