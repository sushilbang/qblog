'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Settings, BookOpen, Palette, LogIn, LogOut, FileText } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/auth-context'

const themes = [
  { id: 'light', name: 'Light' },
  { id: 'caramel', name: 'Caramel' },
  { id: 'desert', name: 'Desert' },
  { id: 'ocean', name: 'Ocean' },
  { id: 'forest', name: 'Forest' },
  { id: 'sunset', name: 'Sunset' },
  { id: 'midnight', name: 'Midnight' },
  { id: 'grape', name: 'Grape' },
]

interface NavMenuProps {
  onCustomPromptClick: () => void
}

export function NavMenu({ onCustomPromptClick }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('light')
  const { user, logout } = useAuth()
  const isLoggedIn = !!user
  const userName = user?.email || null

  useEffect(() => {
    const saved = localStorage.getItem('qblog-theme') || 'light'
    setCurrentTheme(saved)
  }, [])

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId)
    document.documentElement.setAttribute('data-theme', themeId)
    localStorage.setItem('qblog-theme', themeId)
    setIsThemeOpen(false)
  }

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-[var(--bg-2)] transition-colors"
        aria-label="Navigation menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" style={{ color: 'var(--fg-1)' }} />
        ) : (
          <Menu className="w-6 h-6" style={{ color: 'var(--fg-1)' }} />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-50 border"
          style={{
            backgroundColor: 'var(--bg-1)',
            borderColor: 'var(--border-1)',
          }}
        >
          <nav className="flex flex-col">
            {/* User Info (if logged in) */}
            {isLoggedIn && userName && (
              <div className="px-4 py-3 border-b" style={{ borderBottomColor: 'var(--border-1)' }}>
                <p className="text-xs" style={{ color: 'var(--fg-2)' }}>Logged in as</p>
                <p className="text-sm font-medium truncate" style={{ color: 'var(--fg-1)' }}>{userName}</p>
              </div>
            )}

            {/* Blog Library Link */}
            <Link
              href="/blogs"
              className="flex items-center gap-3 px-4 py-3 hover:opacity-90 transition-colors border-b"
              style={{ borderBottomColor: 'var(--border-1)', color: 'var(--fg-1)' }}
              onClick={() => setIsOpen(false)}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium text-sm">Blog Library</span>
            </Link>

            {/* Custom Prompt Button */}
            <button
              onClick={() => {
                onCustomPromptClick()
                setIsOpen(false)
              }}
              className="flex items-center gap-3 px-4 py-3 hover:opacity-90 transition-colors border-b w-full text-left"
              style={{ borderBottomColor: 'var(--border-1)', color: 'var(--fg-1)' }}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium text-sm">Custom Prompt</span>
            </button>

            {/* Theme Selector Button */}
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="flex items-center gap-3 px-4 py-3 hover:opacity-90 transition-colors border-b w-full text-left"
              style={{ borderBottomColor: 'var(--border-1)', color: 'var(--fg-1)' }}
            >
              <Palette className="w-5 h-5" />
              <span className="font-medium text-sm">Theme</span>
              <span className="ml-auto text-xs" style={{ color: 'var(--fg-2)' }}>
                {themes.find(t => t.id === currentTheme)?.name || 'Light'}
              </span>
            </button>

            {/* Theme Options (Submenu) */}
            {isThemeOpen && (
              <div className="px-3 py-2 border-b" style={{ borderBottomColor: 'var(--border-1)', backgroundColor: 'var(--bg-2)' }}>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                        currentTheme === theme.id
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-1)] text-[var(--fg-1)] border border-[var(--border-1)] hover:bg-[var(--bg-3)]'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* About Link */}
            <Link
              href="/about"
              className="flex items-center gap-3 px-4 py-3 hover:opacity-90 transition-colors border-b"
              style={{ borderBottomColor: 'var(--border-1)', color: 'var(--fg-1)' }}
              onClick={() => setIsOpen(false)}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium text-sm">About</span>
            </Link>

            {/* Privacy Policy Link */}
            <Link
              href="/privacy"
              className="flex items-center gap-3 px-4 py-3 hover:opacity-90 transition-colors border-b"
              style={{ borderBottomColor: 'var(--border-1)', color: 'var(--fg-1)' }}
              onClick={() => setIsOpen(false)}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium text-sm">Privacy Policy</span>
            </Link>

            {/* Terms & Conditions Link */}
            <Link
              href="/terms"
              className="flex items-center gap-3 px-4 py-3 hover:opacity-90 transition-colors border-b"
              style={{ borderBottomColor: 'var(--border-1)', color: 'var(--fg-1)' }}
              onClick={() => setIsOpen(false)}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium text-sm">Terms & Conditions</span>
            </Link>

            {/* Auth Section */}
            {!isLoggedIn ? (
              <Link
                href="/auth/login"
                className="flex items-center gap-3 px-4 py-3 hover:opacity-90 transition-colors w-full text-left"
                style={{ color: 'var(--fg-1)' }}
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                <span className="font-medium text-sm">Log In</span>
              </Link>
            ) : (
              <button
                onClick={async () => {
                  await logout()
                  setIsOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-3 hover:opacity-90 transition-colors w-full text-left"
                style={{ color: 'var(--fg-1)' }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Log Out</span>
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
