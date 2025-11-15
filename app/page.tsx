import { ThemeSelector } from '@/components/ThemeSelector'
import { BlogGenerator } from '@/components/BlogGenerator'
import { BlogCard } from '@/components/BlogCard'
import { prisma } from '@/lib/db'
import Link from 'next/link'

async function getRecentBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    })
    return blogs
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export default async function Home() {
  const recentBlogs = await getRecentBlogs()

  return (
    <main className="min-h-screen bg-[var(--bg-1)] text-[var(--fg-1)]">
      {/* Header */}
      <header className="border-b border-[var(--border-1)] sticky top-0 bg-[var(--bg-1)] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity">
            NeuralPost
          </Link>
          <ThemeSelector />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <section className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight text-[var(--fg-1)]">
            Blog Like a Boss with AI
          </h1>
          <p className="text-lg sm:text-xl text-[var(--fg-2)] mb-8">
            Snappy, stunning posts in seconds — because your ideas deserve swagger, not sweat.
          </p>
        </section>

        {/* Generator Section */}
        <section className="mb-20">
          <BlogGenerator />
        </section>

        {/* Recent Blogs Section */}
        {recentBlogs.length > 0 && (
          <section className="mt-32">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-[var(--fg-1)]">Recently Generated</h2>
              <Link
                href="/blogs"
                className="text-sm font-medium text-[var(--fg-2)] hover:text-[var(--fg-1)] transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  content={blog.content}
                  query={blog.query}
                  createdAt={blog.createdAt}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border-1)] mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-[var(--fg-2)]">
          <p>&copy; 2024 NeuralPost. Built with Next.js and Groq AI.</p>
        </div>
      </footer>
    </main>
  )
}
