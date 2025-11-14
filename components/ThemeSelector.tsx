'use client'

import { useEffect, useState } from 'react'
import { Palette } from 'lucide-react'

const themes = [
  { id: 'light', name: 'Light', color: '#ffffff' },
  { id: 'caramel', name: 'Caramel', color: '#fffaf0' },
  { id: 'desert', name: 'Desert', color: '#fffbf0' },
  { id: 'ocean', name: 'Ocean', color: '#f0f7ff' },
  { id: 'forest', name: 'Forest', color: '#f0fdf5' },
  { id: 'sunset', name: 'Sunset', color: '#fff5f0' },
  { id: 'midnight', name: 'Midnight', color: '#1a1a2e' },
  { id: 'grape', name: 'Grape', color: '#faf8ff' },
]

export function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('light')

  useEffect(() => {
    // Load theme from localStorage
    const saved = localStorage.getItem('qblog-theme') || 'light'
    setCurrentTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId)
    document.documentElement.setAttribute('data-theme', themeId)
    localStorage.setItem('qblog-theme', themeId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--border-1)] bg-[var(--bg-2)] text-[var(--fg-1)] hover:bg-[var(--bg-3)] transition-colors"
        aria-label="Change theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-1)] border border-[var(--border-1)] rounded-lg shadow-lg z-50 p-4">
          <h3 className="text-sm font-semibold text-[var(--fg-1)] mb-3">Choose Theme</h3>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  currentTheme === theme.id
                    ? 'border-[var(--accent)] bg-[var(--accent-light)]'
                    : 'border-[var(--border-1)] bg-[var(--bg-2)] hover:bg-[var(--bg-3)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span className="text-[var(--fg-1)]">{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
