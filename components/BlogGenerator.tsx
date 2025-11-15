'use client'

import { useState, createContext } from 'react'
import { useRouter } from 'next/navigation'
import { Loader, ArrowRight } from 'lucide-react'

// Create context to notify parent about blog viewing state
export const BlogViewContext = createContext<{ isViewingBlog: boolean }>({ isViewingBlog: false })

export function BlogGenerator() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate blog')
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
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-3 text-[var(--fg-1)]">
              What would you like to write about?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., 'How to learn React', 'Benefits of meditation'..."
                className="flex-1 px-4 py-3 rounded-lg border border-[var(--border-1)] bg-[var(--bg-1)] text-[var(--fg-1)] placeholder-[var(--fg-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-12 h-12 bg-[var(--accent)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all flex items-center justify-center flex-shrink-0"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-lg border border-red-300 bg-red-50 text-red-700">
          <p className="text-sm font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  )
}
