'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@/app/auth-context'

interface CustomPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (prompt: string) => void
  defaultPrompt: string
}

export function CustomPromptModal({
  isOpen,
  onClose,
  onSave,
  defaultPrompt,
}: CustomPromptModalProps) {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const loadPrompt = async () => {
      setIsLoading(true)
      try {
        // If user is authenticated, load from Firestore
        if (user?.id) {
          const response = await fetch(`/api/custom-prompt?userId=${user.id}`)
          if (response.ok) {
            const data = await response.json()
            if (data.prompt) {
              setPrompt(data.prompt)
            } else {
              // If no Firestore prompt, check localStorage as fallback
              const saved = localStorage.getItem('neuralpost-custom-prompt')
              if (saved) {
                setPrompt(saved)
              }
            }
          }
        } else {
          // Load from localStorage for unauthenticated users
          const saved = localStorage.getItem('neuralpost-custom-prompt')
          if (saved) {
            setPrompt(saved)
          }
        }
      } catch (error) {
        console.error('Error loading custom prompt:', error)
        // Fallback to localStorage on error
        const saved = localStorage.getItem('neuralpost-custom-prompt')
        if (saved) {
          setPrompt(saved)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadPrompt()
  }, [isOpen, user?.id])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // If user is authenticated, save to Firestore
      if (user?.id) {
        const response = await fetch('/api/custom-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            prompt,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to save to Firestore')
        }
      } else {
        // For unauthenticated users, save to localStorage only
        localStorage.setItem('neuralpost-custom-prompt', prompt)
      }

      onSave(prompt)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } catch (error) {
      console.error('Error saving custom prompt:', error)
      // Fallback to localStorage
      localStorage.setItem('neuralpost-custom-prompt', prompt)
      onSave(prompt)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    setIsLoading(true)
    try {
      setPrompt(defaultPrompt)

      // If user is authenticated, delete from Firestore
      if (user?.id) {
        await fetch(`/api/custom-prompt?userId=${user.id}`, {
          method: 'DELETE',
        })
      }

      // Clear localStorage
      localStorage.removeItem('neuralpost-custom-prompt')
      onSave(defaultPrompt)
    } catch (error) {
      console.error('Error resetting custom prompt:', error)
      // Still reset on error
      setPrompt(defaultPrompt)
      localStorage.removeItem('neuralpost-custom-prompt')
      onSave(defaultPrompt)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl rounded-lg shadow-lg z-50 border max-h-[90vh] flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-1)',
          borderColor: 'var(--border-1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderBottomColor: 'var(--border-1)' }}
        >
          <h2
            className="text-xl font-bold"
            style={{ color: 'var(--fg-1)' }}
          >
            Custom Blog Prompt
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--bg-2)] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" style={{ color: 'var(--fg-1)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="mb-4">
            <p className="text-sm mb-4" style={{ color: 'var(--fg-2)' }}>
              Customize the system prompt used for blog generation. {user?.id ? 'Your custom prompt is saved to your account and will be used for all your blog generation.' : 'This will be saved locally and used for your next blog generation.'}
            </p>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--fg-1)' }}
              htmlFor="prompt-textarea"
            >
              System Prompt
            </label>
            <textarea
              id="prompt-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your custom system prompt..."
              disabled={isLoading}
              className="w-full h-48 px-4 py-3 rounded-lg border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--border-1)',
                backgroundColor: 'var(--bg-2)',
                color: 'var(--fg-1)',
                '--tw-ring-color': 'var(--accent)',
              } as React.CSSProperties}
            />
          </div>

          {/* Info Box */}
          <div
            className="p-4 rounded-lg border text-sm"
            style={{
              backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
              borderColor: 'var(--border-1)',
              color: 'var(--fg-2)',
            }}
          >
            <p className="font-medium mb-2">Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Be specific about writing style and tone</li>
              <li>Include formatting requirements (markdown, structure)</li>
              <li>Mention any constraints or preferences</li>
              <li>The prompt will be used for the next blog you generate</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t gap-3"
          style={{ borderTopColor: 'var(--border-1)' }}
        >
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--bg-2)',
              color: 'var(--fg-1)',
            }}
          >
            Reset to Default
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--bg-2)',
                color: 'var(--fg-1)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent)',
                opacity: isSaved ? 0.8 : 1,
              }}
            >
              {isSaved ? '✓ Saved' : isLoading ? 'Saving...' : 'Save Prompt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
