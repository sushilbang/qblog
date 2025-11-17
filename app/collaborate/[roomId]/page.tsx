'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/app/auth-context'
import { useCollaborativeRoom } from '@/hooks/useCollaborativeRoom'
import { ThemeSelector } from '@/components/ThemeSelector'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { ArrowLeft, Users, Loader, Bold, Italic, Heading2, List, Code, Quote, LogOut, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAuth } from 'firebase/auth'

interface CollaboratePageProps {
  params: {
    roomId: string
  }
  searchParams: {
    blogId?: string
  }
}

export default function CollaboratePage({ params, searchParams }: CollaboratePageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorCoords, setCursorCoords] = useState<Map<string, { x: number; y: number }>>(new Map())
  const blogId = searchParams?.blogId
  const {
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
  } = useCollaborativeRoom(
    params.roomId,
    user?.id || 'anonymous',
    user?.email || 'Anonymous User'
  )

  // Ensure we only render on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Use relative coordinates from other users, adjusted for current scroll
  useEffect(() => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const newCoords = new Map<string, { x: number; y: number }>()

    Array.from(userCursors.values()).forEach((cursor) => {
      if (cursor.userId === (user?.id || 'anonymous')) return

      // Use relative coordinates and adjust for our current scroll position
      const x = cursor.relativeX - textarea.scrollLeft
      const y = cursor.relativeY - textarea.scrollTop

      newCoords.set(cursor.userId, { x, y })
    })

    setCursorCoords(newCoords)
  }, [userCursors, user])

  const handleLeaveRoom = () => {
    leaveRoom()
    router.push('/blogs')
  }

  const handleSaveChanges = async () => {
    if (!blogId) {
      setSaveMessage({ type: 'error', text: 'Blog ID not found' })
      return
    }

    setIsSaving(true)
    try {
      const auth = getAuth()
      let idToken: string | undefined

      if (auth.currentUser) {
        idToken = await auth.currentUser.getIdToken()
      }

      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { 'Authorization': `Bearer ${idToken}` })
        },
        body: JSON.stringify({
          title,
          content,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save changes')
      }

      setSaveMessage({ type: 'success', text: 'Changes saved successfully!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      console.error('Save error:', err)
      setSaveMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save changes' })
    } finally {
      setIsSaving(false)
    }
  }

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end)

    updateContent(newContent)

    setTimeout(() => {
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = start + before.length + selectedText.length
      textarea.focus()
    }, 0)
  }

  const getCaretCoordinates = (textarea: HTMLTextAreaElement, position: number) => {
    // Create a clone of the textarea to measure text position
    const div = document.createElement('div')
    const span = document.createElement('span')

    // Copy textarea styles
    const style = window.getComputedStyle(textarea)
    const props = [
      'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
      'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize',
      'fontSizeAdjust', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform',
      'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing', 'tabSize',
      'whiteSpace'
    ]

    props.forEach(prop => {
      div.style[prop as any] = style[prop as any]
    })

    div.style.position = 'absolute'
    div.style.visibility = 'hidden'
    div.style.whiteSpace = 'pre-wrap'
    div.style.wordWrap = 'break-word'

    const text = textarea.value.substring(0, position)
    div.textContent = text
    span.textContent = textarea.value.substring(position) || '.'

    div.appendChild(span)
    document.body.appendChild(div)

    const coordinates = {
      x: span.offsetLeft,
      y: span.offsetTop
    }

    document.body.removeChild(div)

    return coordinates
  }

  const handleCursorChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const coords = getCaretCoordinates(textarea, textarea.selectionStart)

    // Send coordinates relative to textarea (not screen coordinates)
    // This way they work correctly regardless of scrolling
    const relativeX = coords.x
    const relativeY = coords.y

    updateCursorPosition(textarea.selectionStart, relativeX, relativeY)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const coords = getCaretCoordinates(textarea, textarea.selectionStart)

    // Send coordinates relative to textarea (not screen coordinates)
    const relativeX = coords.x
    const relativeY = coords.y

    updateCursorPosition(textarea.selectionStart, relativeX, relativeY)
  }

  const handleScroll = () => {
    if (textareaRef.current) {
      // Trigger recalculation of cursor positions on scroll
      setCursorCoords(new Map(cursorCoords))
    }
  }

  const markdownButtons = [
    {
      icon: Bold,
      tooltip: 'Bold',
      onClick: () => insertMarkdown('**', '**'),
    },
    {
      icon: Italic,
      tooltip: 'Italic',
      onClick: () => insertMarkdown('*', '*'),
    },
    {
      icon: Heading2,
      tooltip: 'Heading',
      onClick: () => insertMarkdown('## '),
    },
    {
      icon: List,
      tooltip: 'List',
      onClick: () => insertMarkdown('- '),
    },
    {
      icon: Code,
      tooltip: 'Code Block',
      onClick: () => insertMarkdown('```\n', '\n```'),
    },
    {
      icon: Quote,
      tooltip: 'Quote',
      onClick: () => insertMarkdown('> '),
    },
  ]

  const wordCount = content.trim().split(/\s+/).length
  const charCount = content.length

  if (!isClient) {
    return null
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-1)', color: 'var(--fg-1)' }}>
        <div className="text-center">
          <p className="text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push('/blogs')}
            className="px-6 py-3 rounded-lg"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            Back to Blogs
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-1)', color: 'var(--fg-1)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3 border-b" style={{ backgroundColor: 'var(--bg-1)', borderBottomColor: 'var(--border-1)' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLeaveRoom}
              className="inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
              style={{ color: 'var(--fg-1)' }}
              title="Leave room"
            >
              <LogOut className="w-4 h-4" />
              Leave
            </button>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{connectedUsers.length} collaborators</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {connectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold"
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--fg-2)' }}>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Connected
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--fg-2)' }}>
                  <Loader className="w-3 h-3 animate-spin" />
                  Connecting...
                </div>
              )}
            </div>
            {blogId && (
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-white transition-opacity"
                style={{
                  backgroundColor: 'var(--accent)',
                  opacity: isSaving ? 0.6 : 1,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
                title="Save changes to blog"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            )}
            <ThemeSelector />
          </div>
        </div>
        {saveMessage && (
          <div className={`mt-2 text-sm p-2 rounded ${saveMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {saveMessage.text}
          </div>
        )}
      </header>

      {/* Title Input */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b" style={{ borderBottomColor: 'var(--border-1)' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Collaborative blog title..."
          className="w-full text-2xl font-bold px-3 py-2 rounded-lg border-2 border-[var(--border-1)] bg-[var(--bg-1)] text-[var(--fg-1)] placeholder-[var(--fg-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
        />
      </div>

      {/* Editor & Preview Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col border-r" style={{ borderRightColor: 'var(--border-1)' }}>
          {/* Toolbar */}
          <div
            className="px-4 py-2 border-b flex items-center gap-1 flex-wrap"
            style={{ borderBottomColor: 'var(--border-1)' }}
          >
            {markdownButtons.map((btn) => {
              const Icon = btn.icon
              return (
                <button
                  key={btn.tooltip}
                  onClick={btn.onClick}
                  className="p-1.5 rounded hover:opacity-70 transition-opacity"
                  style={{
                    backgroundColor: 'var(--bg-2)',
                    color: 'var(--fg-1)',
                  }}
                  title={btn.tooltip}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>

          {/* Textarea with Cursor Tracking */}
          <div className="flex-1 relative overflow-hidden">
            <textarea
              ref={textareaRef}
              id="content-textarea"
              value={content}
              onChange={(e) => updateContent(e.target.value)}
              onMouseUp={handleCursorChange}
              onMouseMove={handleMouseMove}
              onKeyUp={handleCursorChange}
              onScroll={handleScroll}
              onTouchMove={handleScroll}
              placeholder="Write your collaborative blog content in Markdown..."
              className="w-full h-full px-4 py-3 bg-[var(--bg-1)] text-[var(--fg-1)] font-mono text-sm focus:outline-none resize-none relative z-0"
            />

            {/* Cursor Indicators Overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
              {Array.from(userCursors.values()).map((cursor) => {
                if (cursor.userId === (user?.id || 'anonymous')) return null

                const coords = cursorCoords.get(cursor.userId)
                if (!coords) return null

                return (
                  <div key={cursor.userId} style={{ position: 'absolute', left: `${coords.x}px`, top: `${coords.y}px` }}>
                    {/* Cursor line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '-20px',
                        width: '2px',
                        height: '24px',
                        backgroundColor: '#3B82F6',
                        zIndex: 5,
                      }}
                    />
                    {/* Name badge */}
                    <div
                      className="font-mono text-xs font-bold px-2 py-1 rounded shadow-lg"
                      style={{
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        position: 'absolute',
                        top: '-28px',
                        left: '-4px',
                        whiteSpace: 'nowrap',
                        zIndex: 10,
                      }}
                      title={cursor.userName}
                    >
                      {cursor.userName.split('@')[0]}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div
            className="px-4 py-2 border-t text-xs flex gap-4"
            style={{ borderTopColor: 'var(--border-1)', color: 'var(--fg-2)' }}
          >
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview Header */}
          <div
            className="px-4 py-2 border-b"
            style={{ borderBottomColor: 'var(--border-1)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--fg-2)' }}>
              PREVIEW
            </span>
          </div>

          {/* Preview Content */}
          <div
            className="flex-1 overflow-y-auto px-6 py-4"
            style={{ backgroundColor: 'var(--bg-2)' }}
          >
            {content.trim() ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p style={{ color: 'var(--fg-2)' }}>
                Start typing to see preview...
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
