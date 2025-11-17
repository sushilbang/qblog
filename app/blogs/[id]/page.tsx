'use client'

import { useState, useEffect } from 'react'
import { ThemeSelector } from '@/components/ThemeSelector'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { ImageBanner } from '@/components/ImageBanner'
import { BlogEditor } from '@/components/BlogEditor'
import { BlogFooter } from '@/components/BlogFooter'
import { FunFactLoader } from '@/components/FunFactLoader'
import { formatDate, calculateReadingTime } from '@/lib/utils'
import { ArrowLeft, Loader, Edit2, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAuth } from 'firebase/auth'
import { useAuth } from '@/app/auth-context'
import { RoomShareDialog } from '@/components/RoomShareDialog'

interface Blog {
  id: string
  userId: string | null
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
  const { user } = useAuth()
  const router = useRouter()
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
  const [showRoomDialog, setShowRoomDialog] = useState(false)
  const [roomLink, setRoomLink] = useState<string | null>(null)
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)

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
      // Get Firebase token for authorization
      const auth = getAuth()
      let idToken: string | undefined

      if (auth.currentUser) {
        idToken = await auth.currentUser.getIdToken()
      }

      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { 'Authorization': `Bearer ${idToken}` })
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save changes')
      }

      const updatedBlog = await response.json()
      setBlog(updatedBlog)
      setIsEditMode(false)
      setSaveMessage({ type: 'success', text: 'Blog updated successfully!' })

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      console.error('Save error:', err)
      setSaveMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save changes. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const createCollaborativeRoom = async () => {
    if (!blog) return
    setIsCreatingRoom(true)
    try {
      const response = await fetch(`/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: blog.id })
      })
      if (!response.ok) throw new Error('Failed to create room')
      const { roomId } = await response.json()
      const shareLink = `${window.location.origin}/collaborate/${roomId}?blogId=${blog.id}`
      setRoomLink(shareLink)
      setShowRoomDialog(true)
    } catch (err) {
      console.error('Failed to create room:', err)
    } finally {
      setIsCreatingRoom(false)
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

  // Show fun fact loader while blog is being generated
  if (isGenerating) {
    return <FunFactLoader query={blog?.query} />
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

          {/* Edit Button - only show if user is the blog owner */}
          {user && blog.userId === user.id && (
            <div className="mb-8 flex gap-2 justify-end">
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--bg-2)] text-[var(--fg-1)] hover:bg-[var(--bg-3)] transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={createCollaborativeRoom}
                disabled={isCreatingRoom}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--bg-2)] text-[var(--fg-1)] hover:bg-[var(--bg-3)] transition-colors disabled:opacity-50"
              >
                <Users className="w-4 h-4" />
                {isCreatingRoom ? 'Creating...' : 'Collaborate'}
              </button>
            </div>
          )}

          {/* Content */}
          <div className="max-w-none">
            <MarkdownRenderer content={blog.content} />
          </div>
        </article>
      </div>

      {/* Footer */}
      <BlogFooter />

      {/* Room Share Dialog */}
      <RoomShareDialog
        isOpen={showRoomDialog}
        roomLink={roomLink}
        onClose={() => setShowRoomDialog(false)}
      />
    </main>
  )
}
