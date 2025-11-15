'use client'

import { useState, createContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader, ArrowRight } from 'lucide-react'
import { useAuth } from '@/app/auth-context'

// Create context to notify parent about blog viewing state
export const BlogViewContext = createContext<{ isViewingBlog: boolean }>({ isViewingBlog: false })

interface BlogGeneratorProps {
  customPrompt?: string
}

export function BlogGenerator({ customPrompt }: BlogGeneratorProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedCustomPrompt, setSavedCustomPrompt] = useState<string | null>(null)

  // Load custom prompt from Firestore (if authenticated) or localStorage
  useEffect(() => {
    const loadCustomPrompt = async () => {
      try {
        // If user is authenticated, try to load from Firestore
        if (user?.id) {
          const response = await fetch(`/api/custom-prompt?userId=${user.id}`)
          if (response.ok) {
            const data = await response.json()
            if (data.prompt) {
              setSavedCustomPrompt(data.prompt)
              return
            }
          }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem('neuralpost-custom-prompt')
        if (saved) {
          setSavedCustomPrompt(saved)
        }
      } catch (error) {
        console.error('Error loading custom prompt:', error)
        // Fallback to localStorage on error
        const saved = localStorage.getItem('neuralpost-custom-prompt')
        if (saved) {
          setSavedCustomPrompt(saved)
        }
      }
    }

    loadCustomPrompt()
  }, [user?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError('')

    // Use passed prop, localStorage value, or undefined (for default)
    const promptToUse = customPrompt || savedCustomPrompt || undefined

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          ...(promptToUse && { customPrompt: promptToUse }),
          ...(user?.id && { userId: user.id }),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Handle rate limit error (429)
        if (response.status === 429) {
          const resetDate = new Date(errorData.resetAt)
          const timeUntilReset = Math.ceil((resetDate.getTime() - new Date().getTime()) / 60000)
          setError(errorData.error || `Rate limit exceeded. Try again in ${timeUntilReset} minutes.`)
        } else {
          setError(errorData.error || 'Failed to generate blog')
        }
        setIsLoading(false)
        return
      }

      const data = await response.json()

      if (!data.id) {
        throw new Error('No blog ID returned')
      }

      // Redirect to blog detail page
      router.push(`/blogs/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error:', err)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What would you like to write about?"
            className="flex-1 px-6 py-4 rounded-lg border bg-[var(--bg-2)] text-[var(--fg-1)] placeholder-[var(--fg-2)] focus:outline-none focus:ring-2 focus:border-transparent transition-all text-lg"
            style={{
              borderColor: 'var(--button-bg)',
              borderWidth: '1px',
              '--tw-ring-color': 'var(--button-bg)'
            } as React.CSSProperties}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-14 h-14 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'var(--button-bg)',
              color: 'var(--button-fg)'
            }}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <ArrowRight className="w-6 h-6" />
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 rounded-lg border border-red-500" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: 'rgb(220, 38, 38)' }}>
          <p className="text-sm font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  )
}
