'use client'

import { useState, useEffect } from 'react'
import { ThemeSelector } from '@/components/ThemeSelector'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { ImageBanner } from '@/components/ImageBanner'
import { BlogEditor } from '@/components/BlogEditor'
import { BlogFooter } from '@/components/BlogFooter'
import { formatDate, calculateReadingTime } from '@/lib/utils'
import { ArrowLeft, Loader, Edit2 } from 'lucide-react'
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
  const [isEditMode, setIsEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false)

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

  const regenerateImage = async () => {
    if (!blog) return

    setIsRegeneratingImage(true)
    try {
      const response = await fetch(`/api/blogs/${blog.id}/regenerate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Failed to regenerate image')
      }

      const updatedBlog = await response.json()
      setBlog(updatedBlog)
    } catch (err) {
      console.error('Error regenerating image:', err)
    } finally {
      setIsRegeneratingImage(false)
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
          {/* Image Banner */}
          {blog.imageUrl && (
            <ImageBanner
              imageUrl={blog.imageUrl}
              title={blog.title}
              blogId={blog.id}
              onRegenerate={regenerateImage}
            />
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
      </div>

      {/* Footer */}
      <BlogFooter />
    </main>
  )
}
