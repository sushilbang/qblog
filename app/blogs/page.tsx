'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BlogCard } from '@/components/BlogCard'
import { Search, Loader } from 'lucide-react'
import Link from 'next/link'

interface Blog {
  id: string
  title: string
  content: string
  query: string
  createdAt: string
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
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-black dark:border-white sticky top-0 bg-white dark:bg-black z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
            qBlog
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-8">Blog Library</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search blogs by title, topic, or content..."
                className="w-full pl-10 pr-4 py-3 border border-black dark:border-white rounded-lg bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 border border-red-500 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 animate-spin opacity-60" />
              <p className="text-sm opacity-60">Loading blogs...</p>
            </div>
          </div>
        )}

        {/* Blogs Grid */}
        {!isLoading && blogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  content={blog.content}
                  query={blog.query}
                  createdAt={new Date(blog.createdAt)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-black dark:border-white rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-black dark:border-white rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && blogs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg opacity-60 mb-4">No blogs found</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
            >
              Generate your first blog
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-black dark:border-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm opacity-60">
          <p>&copy; 2024 qBlog. Built with Next.js and Groq AI.</p>
        </div>
      </footer>
    </main>
  )
}
