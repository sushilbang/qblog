'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{ borderTopColor: 'var(--border-1)', borderTopWidth: '1px', color: 'var(--fg-2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--fg-1)' }}>Product</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--fg-2)' }}>
              <li>
                <Link href="/" className="hover:text-[var(--accent)] transition-colors">
                  Generate Blog
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-[var(--accent)] transition-colors">
                  Blog Library
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--fg-1)' }}>Company</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--fg-2)' }}>
              <li>
                <Link href="/about" className="hover:text-[var(--accent)] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="https://sushilbang.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
                  Creator
                </a>
              </li>
              {/* <li>
                <a href="https://buymeacoffee.com/sushilbang" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fg-2)' }} className="hover:text-[var(--accent)] transition-colors">
                  Buy Me a Coffee ☕
                </a>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--fg-1)' }}>Legal</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--fg-2)' }}>
              <li>
                <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--accent)] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTopColor: 'var(--border-1)', borderTopWidth: '1px', marginBottom: '0.5rem' }} />

        {/* Bottom Section */}
        <div className="text-center text-sm" style={{ color: 'var(--fg-2)', margin: 0, padding: 0 }}>
          <p style={{ margin: 0, padding: 0 }}>Made by <a href="https://sushilbang.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline', cursor: 'pointer' }}>Sushil</a></p>
        </div>
      </div>
    </footer>
  )
}
