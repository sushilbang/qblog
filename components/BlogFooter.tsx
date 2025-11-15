'use client'

import Link from 'next/link'

export function BlogFooter() {
  return (
    <footer style={{ borderTopColor: 'var(--border-1)', borderTopWidth: '1px', color: 'var(--fg-2)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex gap-6 text-xs sm:text-sm flex-wrap justify-center sm:justify-start">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              Generate Blog
            </Link>
            <Link href="/blogs" className="hover:text-[var(--accent)] transition-colors">
              Blog Library
            </Link>
            <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--accent)] transition-colors">
              Terms
            </Link>
          </div>
          <p style={{ margin: 0, padding: 0 }}>Made by <a href="https://sushilbang.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline', cursor: 'pointer' }}>Sushil</a></p>
        </div>
      </div>
    </footer>
  )
}
