'use client'

import { useState } from 'react'
import Image from 'next/image'
import { RotateCw } from 'lucide-react'

interface ImageBannerProps {
  imageUrl?: string | null
  title?: string
  isLoading?: boolean
  onReload?: () => void
}

export function ImageBanner({ imageUrl, title, isLoading, onReload }: ImageBannerProps) {
  const [hasError, setHasError] = useState(false)
  const [showReloadBtn, setShowReloadBtn] = useState(false)

  if (isLoading) {
    return (
      <div className="w-full h-48 sm:h-64 lg:h-80 mb-8 rounded-lg overflow-hidden bg-[var(--bg-2)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--bg-3)] border-t-[var(--accent)] animate-spin" />
          </div>
          <p className="text-sm text-[var(--fg-2)]">Generating image...</p>
        </div>
      </div>
    )
  }

  if (!imageUrl || hasError) {
    return null
  }

  return (
    <div
      className="w-full h-48 sm:h-64 lg:h-80 mb-8 rounded-lg overflow-hidden border border-[var(--border-1)] relative group"
      onMouseEnter={() => setShowReloadBtn(true)}
      onMouseLeave={() => setShowReloadBtn(false)}
    >
      <img
        src={imageUrl}
        alt={title || 'Blog banner'}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />

      {/* Reload Button */}
      {onReload && (
        <button
          onClick={onReload}
          className={`absolute top-3 right-3 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-all ${
            showReloadBtn ? 'opacity-100' : 'opacity-0'
          }`}
          title="Regenerate image"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
