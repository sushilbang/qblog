'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { getRandomFunFact } from '@/lib/fun-facts'

interface FunFactLoaderProps {
  query?: string
}

export function FunFactLoader({ query }: FunFactLoaderProps) {
  const [funFact, setFunFact] = useState('')
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    // Set initial fun fact
    setFunFact(getRandomFunFact(query))

    // Change fun fact every 6 seconds
    const interval = setInterval(() => {
      setIsChanging(true)
      setTimeout(() => {
        setFunFact(getRandomFunFact(query))
        setIsChanging(false)
      }, 300)
    }, 6000)

    return () => clearInterval(interval)
  }, [query])

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-1)', color: 'var(--fg-1)' }}>
      <div className="flex flex-col items-center gap-6 text-center max-w-lg px-6">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--bg-3)] border-t-[var(--accent)] animate-spin" />
        </div>

        {/* Main Text */}
        <div>
          <p className="text-xl font-semibold text-[var(--fg-1)]">
            Creating your blog
          </p>
          <p className="text-sm text-[var(--fg-2)] mt-2">
            Hang tight while the AI works its magic...
          </p>
        </div>

        {/* Fun Fact Section */}
        <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--bg-3)' }}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--accent)' }}>
                Fun Fact
              </p>
              <p className={`text-sm leading-relaxed transition-opacity duration-300 ${isChanging ? 'opacity-50' : 'opacity-100'}`} style={{ color: 'var(--fg-2)' }}>
                {funFact}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
