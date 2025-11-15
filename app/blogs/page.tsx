'use client'

import { useState, useEffect } from 'react'
import { BlogCard } from '@/components/BlogCard'
import { Footer } from '@/components/Footer'
import { Search, Loader } from 'lucide-react'
import Link from 'next/link'

interface Blog {
  id: string
  title: string
  content: string
  query: string
  createdAt: string
  imageUrl?: string | null
}

interface PaginationData {
  blogs: Blog[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const limit = 12

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true)
      setError('')
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
        })

        const response = await fetch(`/api/blogs?${params}`)
        if (!response.ok) throw new Error('Failed to fetch blogs')

        const data: PaginationData = await response.json()
        setBlogs(
          data.blogs.map((blog) => ({
            ...blog,
            createdAt: new Date(blog.createdAt),
          })) as any
        )
        setTotalPages(data.pagination.pages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blogs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [page, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-1)', color: 'var(--fg-1)' }}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-8">Blog Library</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--fg-2)' }} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search blogs by title, topic, or content..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder-opacity-60"
                style={{
                  borderColor: 'var(--border-1)',
                  backgroundColor: 'var(--bg-2)',
                  color: 'var(--fg-1)',
                  '--tw-ring-color': 'var(--accent)'
                } as React.CSSProperties}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-opacity whitespace-nowrap"
              style={{
                backgroundColor: 'var(--button-bg)',
                color: 'var(--button-fg)'
              }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 border border-red-500 rounded-lg text-red-600" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 animate-spin" style={{ color: 'var(--fg-2)' }} />
              <p className="text-sm" style={{ color: 'var(--fg-2)' }}>Loading blogs...</p>
            </div>
          </div>
        )}

        {/* Blogs Grid */}
        {!isLoading && blogs.length > 0 && (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm opacity-60">Showing <span className="font-semibold">{blogs.length}</span> blogs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  content={blog.content}
                  query={blog.query}
                  createdAt={new Date(blog.createdAt)}
                  imageUrl={blog.imageUrl}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 pt-8" style={{ borderTopColor: 'var(--border-1)', borderTopWidth: '1px' }}>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: 'var(--button-bg)',
                    borderWidth: '1px',
                    color: 'var(--button-fg)',
                    backgroundColor: 'var(--button-bg)'
                  }}
                  onMouseEnter={(e) => {
                    if (page !== 1) {
                      e.currentTarget.style.backgroundColor = 'var(--accent)'
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--button-bg)'
                    e.currentTarget.style.borderColor = 'var(--button-bg)'
                  }}
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNum = i + 1
                    const isActive = page === pageNum
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className="px-3 py-2 rounded-lg transition-all font-medium"
                        style={{
                          backgroundColor: isActive ? 'var(--accent)' : 'var(--button-bg)',
                          color: 'white',
                          borderColor: isActive ? 'var(--accent)' : 'var(--button-bg)',
                          borderWidth: '1px'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'var(--accent)'
                            e.currentTarget.style.borderColor = 'var(--accent)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'var(--button-bg)'
                            e.currentTarget.style.borderColor = 'var(--button-bg)'
                          }
                        }}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  {totalPages > 5 && (
                    <span className="px-2 py-2" style={{ color: 'var(--fg-2)' }}>...</span>
                  )}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: 'var(--button-bg)',
                    borderWidth: '1px',
                    color: 'var(--button-fg)',
                    backgroundColor: 'var(--button-bg)'
                  }}
                  onMouseEnter={(e) => {
                    if (page !== totalPages) {
                      e.currentTarget.style.backgroundColor = 'var(--accent)'
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--button-bg)'
                    e.currentTarget.style.borderColor = 'var(--button-bg)'
                  }}
                >
                  Next →
                </button>
              </div>
              <p className="text-center text-sm mt-4" style={{ color: 'var(--fg-2)' }}>Page {page} of {totalPages}</p>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && blogs.length === 0 && (
          <div className="text-center py-24">
            <div className="mb-6">
              <p className="text-2xl font-bold mb-2" style={{ color: 'var(--fg-1)' }}>No blogs found</p>
              <p className="text-sm mb-6" style={{ color: 'var(--fg-2)' }}>
                {search ? `No results for "${search}". Try a different search or create a new blog!` : 'Start creating amazing blogs with AI!'}
              </p>
            </div>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-lg hover:opacity-80 transition-opacity font-semibold"
              style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-fg)' }}
            >
              Generate your first blog
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
