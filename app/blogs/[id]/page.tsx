'use client'

import { useState, useEffect } from 'react'
import { ThemeSelector } from '@/components/ThemeSelector'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { ImageBanner } from '@/components/ImageBanner'
import { BlogEditor } from '@/components/BlogEditor'
import { formatDate, calculateReadingTime } from '@/lib/utils'
import { Copy, Share2, ArrowLeft, Loader, Image as ImageIcon, Edit2 } from 'lucide-react'
import Link from 'next/link'

interface Blog {
  id: string
  title: string
  content: string
  query: string
  imageUrl?: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  metadata?: any
}

interface BlogDetailPageProps {
  params: {
    id: string
  }
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(true)
  const [error, setError] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`)
        if (!response.ok) {
          throw new Error('Blog not found')
        }
        const data = await response.json()
        setBlog(data)

        // Check if blog content is still being generated
        if (data.content && data.content.trim() && data.title !== 'Generating...') {
          setIsGenerating(false)
          // Stop polling once content is ready
          if (intervalId) {
            clearInterval(intervalId)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog')
        setIsGenerating(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchBlog()

    // Poll for updates every 2 seconds while generating
    intervalId = setInterval(fetchBlog, 2000)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [params.id])

  const copyToClipboard = async () => {
    if (blog) {
      try {
        await navigator.clipboard.writeText(blog.content)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const shareContent = async () => {
    if (blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.content,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Failed to share:', err)
      }
    }
  }

  const generateImage = async () => {
    if (!blog) return

    setIsGeneratingImage(true)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: blog.query }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()

      // Update blog with new image
      const updateResponse = await fetch(`/api/blogs/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: data.imageUrl }),
      })

      if (updateResponse.ok) {
        setBlog({ ...blog, imageUrl: data.imageUrl })
      } else {
        throw new Error('Failed to save image')
      }
    } catch (err) {
      console.error('Image generation error:', err)
      alert('Failed to generate image. Please try again.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const startEdit = () => {
    if (blog) {
      setEditTitle(blog.title)
      setEditContent(blog.content)
      setIsEditMode(true)
      setSaveMessage(null)
    }
  }

  const cancelEdit = () => {
    setIsEditMode(false)
    setEditTitle('')
    setEditContent('')
    setSaveMessage(null)
  }

  const saveChanges = async () => {
    if (!blog || !editTitle.trim() || !editContent.trim()) {
      setSaveMessage({ type: 'error', text: 'Title and content cannot be empty' })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save changes')
      }

      const updatedBlog = await response.json()
      setBlog(updatedBlog)
      setIsEditMode(false)
      setSaveMessage({ type: 'success', text: 'Blog updated successfully!' })

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      console.error('Save error:', err)
      setSaveMessage({ type: 'error', text: 'Failed to save changes. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  // Show editor mode
  if (isEditMode && blog) {
    return (
      <BlogEditor
        title={editTitle}
        content={editContent}
        onTitleChange={setEditTitle}
        onContentChange={setEditContent}
        onSave={saveChanges}
        onCancel={cancelEdit}
        isSaving={isSaving}
        saveMessage={saveMessage}
      />
    )
  }

  // Show full-screen loading state while blog is being generated
  if (isGenerating) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-1)', color: 'var(--fg-1)' }}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[var(--bg-3)] border-t-[var(--accent)] animate-spin" />
          </div>
          <div>
            <p className="text-xl font-semibold text-[var(--fg-1)]">
              Creating your blog
            </p>
            <p className="text-sm text-[var(--fg-2)] mt-2">
              This may take a moment...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-1)', color: 'var(--fg-1)' }}>
        {/* Minimal Header */}
        <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4" style={{ borderBottomColor: 'var(--border-1)', borderBottomWidth: '1px', backgroundColor: 'var(--bg-1)' }}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
              style={{ color: 'var(--fg-1)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <ThemeSelector />
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-lg mb-4" style={{ color: 'var(--fg-2)' }}>{error || 'Blog not found'}</p>
            <Link
              href="/blogs"
              className="inline-block px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'white',
                borderColor: 'var(--accent)',
                borderWidth: '1px'
              }}
            >
              Back to Blogs
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const readingTime = calculateReadingTime(blog.content)
  const createdAt = new Date(blog.createdAt)

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-1)', color: 'var(--fg-1)' }}>
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4" style={{ backgroundColor: 'var(--bg-1)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--fg-1)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <ThemeSelector />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Blog Header */}
        <article>
          {/* Image Banner or Generate Button */}
          {blog.imageUrl ? (
            <div className="mb-8">
              <ImageBanner
                imageUrl={blog.imageUrl}
                title={blog.title}
                isLoading={isGeneratingImage}
                onReload={generateImage}
              />
            </div>
          ) : (
            <div className="mb-8 p-8 rounded-lg border-2 border-dashed border-[var(--border-1)] flex flex-col items-center justify-center gap-4 text-center">
              <ImageIcon className="w-12 h-12" style={{ color: 'var(--fg-2)' }} />
              <div>
                <p className="font-medium" style={{ color: 'var(--fg-1)' }}>
                  No banner image yet
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--fg-2)' }}>
                  Generate an AI image to make your blog more visually appealing
                </p>
              </div>
              <button
                onClick={generateImage}
                disabled={isGeneratingImage}
                className="mt-2 px-6 py-2 rounded-lg font-medium text-white transition-opacity flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--accent)',
                  opacity: isGeneratingImage ? 0.6 : 1,
                  cursor: isGeneratingImage ? 'not-allowed' : 'pointer',
                }}
              >
                {isGeneratingImage ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    Generate Banner
                  </>
                )}
              </button>
            </div>
          )}

          {/* Edit Button */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={startEdit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--bg-2)] text-[var(--fg-1)] hover:bg-[var(--bg-3)] transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>

          {/* Content */}
          <div className="max-w-none">
            <MarkdownRenderer content={blog.content} />
          </div>
        </article>

        {/* Related Actions */}
        <div className="mt-16 pt-8" style={{ borderTopColor: 'var(--border-1)', borderTopWidth: '1px' }}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
            <Link
              href="/"
              className="inline-block px-4 py-2 border rounded-lg text-center hover:opacity-80 transition-colors text-sm"
              style={{
                borderColor: 'var(--border-1)',
                color: 'var(--fg-1)',
                backgroundColor: 'var(--bg-2)'
              }}
            >
              Generate New
            </Link>
            <Link
              href="/blogs"
              className="inline-block px-4 py-2 border rounded-lg text-center hover:opacity-80 transition-colors text-sm"
              style={{
                borderColor: 'var(--border-1)',
                color: 'var(--fg-1)',
                backgroundColor: 'var(--bg-2)'
              }}
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16" style={{ borderTopColor: 'var(--border-1)', borderTopWidth: '1px', color: 'var(--fg-2)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm">
          <p>&copy; 2024 NeuralPost. Built with Next.js and Groq AI.</p>
        </div>
      </footer>
    </main>
  )
}
