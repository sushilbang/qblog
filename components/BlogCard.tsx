'use client'

import Link from 'next/link'
import { formatDate, truncateContent, calculateReadingTime } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface BlogCardProps {
  id: string
  title: string
  content: string
  query: string
  createdAt: Date
  imageUrl?: string | null
}

export function BlogCard({ id, title, content, query, createdAt, imageUrl }: BlogCardProps) {
  const readingTime = calculateReadingTime(content)
  const preview = truncateContent(content.replace(/[#*\[\]()]/g, ''), 150)

  return (
    <Link href={`/blogs/${id}`}>
      <article className="border rounded-lg hover:shadow-lg transition-all cursor-pointer h-full flex flex-col group overflow-hidden" style={{
        backgroundColor: 'var(--bg-2)',
        borderColor: 'var(--border-1)',
        color: 'var(--fg-1)'
      }}>
        {/* Image */}
        {imageUrl && (
          <div className="w-full h-48 bg-gradient-to-br overflow-hidden" style={{ backgroundColor: 'var(--bg-3)' }}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col p-6">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:opacity-80 transition-colors" style={{ color: 'var(--fg-1)' }}>{title}</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--fg-2)' }}>{query}</p>
            <p className="text-sm line-clamp-3" style={{ color: 'var(--fg-2)' }}>{preview}</p>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTopColor: 'var(--border-1)', borderTopWidth: '1px' }}>
            <div className="text-xs" style={{ color: 'var(--fg-2)' }}>
              <time>{formatDate(createdAt)}</time>
              <span className="mx-2">•</span>
              <span>{readingTime} min</span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: 'var(--fg-2)' }} />
          </div>
        </div>
      </article>
    </Link>
  )
}
