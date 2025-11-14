'use client'

import { useState, createContext, useContext } from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { Copy, Share2, Loader, ArrowLeft, ArrowRight } from 'lucide-react'

// Create context to notify parent about blog viewing state
export const BlogViewContext = createContext<{ isViewingBlog: boolean }>({ isViewingBlog: false })

export function BlogGenerator() {
  const [query, setQuery] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setIsGenerating(true)
    setError('')
    setContent('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate blog')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                setContent((prev) => prev + data.content)
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareContent = async () => {
    const title = content.split('\n')[0]?.replace(/^# /, '') || 'Blog Post'
    try {
      await navigator.share({
        title,
        text: content,
        url: window.location.href,
      })
    } catch (err) {
      console.error('Failed to share:', err)
    }
  }

  const handleStartOver = () => {
    setContent('')
    setQuery('')
    setError('')
  }

  // Show blog content in full view with minimal header
  if (content && !isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-[var(--bg-1)]">
        {/* Minimal Header - Just Back Button */}
        <div className="border-b border-[var(--border-1)] px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleStartOver}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--fg-1)] hover:bg-[var(--bg-2)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            New Blog
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-16 px-4">
          <div className="w-full max-w-4xl mx-auto">
            {/* Action Buttons */}
            <div className="flex gap-3 justify-end mb-8">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--bg-2)] text-[var(--fg-1)] hover:bg-[var(--bg-3)] transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              {typeof window !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={shareContent}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--bg-2)] text-[var(--fg-1)] hover:bg-[var(--bg-3)] transition-colors"
                  title="Share blog"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              )}
            </div>

            {/* Content */}
            <div className="bg-[var(--bg-1)] rounded-lg shadow-sm border border-[var(--border-1)] p-12">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show generator form
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

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-[var(--bg-3)] border-t-[var(--accent)] animate-spin" />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-[var(--fg-1)]">
                Crafting your blog...
              </p>
              <p className="text-sm text-[var(--fg-2)] mt-2">
                This may take a moment
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
