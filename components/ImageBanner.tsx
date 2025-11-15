'use client'

import { useState } from 'react'
import { RotateCw } from 'lucide-react'

interface ImageBannerProps {
  imageUrl?: string | null
  title?: string
  blogId?: string
  onRegenerate?: () => void
}

export function ImageBanner({ imageUrl, title, blogId, onRegenerate }: ImageBannerProps) {
  const [hasError, setHasError] = useState(false)
  const [isReloading, setIsReloading] = useState(false)

  if (!imageUrl || hasError) {
    return null
  }

  const handleReload = async () => {
    if (!onRegenerate) return
    setIsReloading(true)
    await onRegenerate()
    setIsReloading(false)
  }

  return (
    <div className="mb-8">
      <div className="relative w-full h-48 sm:h-64 lg:h-80 rounded-lg overflow-hidden border border-[var(--border-1)]" onMouseEnter={() => {}} onMouseLeave={() => {}}>
        <img
          src={imageUrl}
          alt={title || 'Blog banner'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
        {onRegenerate && (
          <button
            onClick={handleReload}
            disabled={isReloading}
            className="absolute top-3 right-3 p-2 rounded-lg bg-[var(--bg-1)] hover:bg-[var(--bg-2)] transition-all disabled:opacity-50"
            style={{ opacity: 0.7 }}
            title="Regenerate image"
          >
            <RotateCw className={`w-5 h-5 ${isReloading ? 'animate-spin' : ''}`} style={{ color: 'var(--fg-1)' }} />
          </button>
        )}
      </div>
    </div>
  )
}
