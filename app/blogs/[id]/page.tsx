'use client'

import { useState, useEffect } from 'react'
import { ThemeSelector } from '@/components/ThemeSelector'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { formatDate, calculateReadingTime } from '@/lib/utils'
import { Copy, Share2, ArrowLeft, Loader } from 'lucide-react'
import Link from 'next/link'

interface Blog {
  id: string
  title: string
  content: string
  query: string
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
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`)
        if (!response.ok) {
          throw new Error('Blog not found')
        }
        const data = await response.json()
        setBlog(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
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

  if (isLoading) {
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
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 animate-spin" style={{ color: 'var(--fg-2)' }} />
            <p className="text-sm" style={{ color: 'var(--fg-2)' }}>Loading blog...</p>
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
          {/* <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold" style={{ color: 'var(--fg-1)' }}>{blog.title}</h1>
          </div> */}

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
          <p>&copy; 2024 qBlog. Built with Next.js and Groq AI.</p>
        </div>
      </footer>
    </main>
  )
}
