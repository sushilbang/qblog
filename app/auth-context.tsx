'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { loginUser, signupUser, logoutUser, subscribeToAuthChanges } from '@/lib/auth'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<string>
  signup: (email: string, password: string) => Promise<string>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const userCredential = await loginUser(email, password)
    setUser({
      id: userCredential.user.uid,
      email: userCredential.user.email || '',
    })
    return userCredential.user.uid
  }

  const signup = async (email: string, password: string) => {
    const userCredential = await signupUser(email, password)
    setUser({
      id: userCredential.user.uid,
      email: userCredential.user.email || '',
    })
    return userCredential.user.uid
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
