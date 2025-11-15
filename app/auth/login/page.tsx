'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/app/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const userId = await login(email, password)

      // Claim unsigned blogs created from the same IP
      try {
        await fetch('/api/claim-blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        })
      } catch (claimError) {
        // Log the error but don't block the login flow
        console.error('Error claiming blogs:', claimError)
      }

      // Redirect to home after successful login
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-1)', color: 'var(--fg-1)' }}>
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--fg-1)' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--fg-2)' }}>Sign in to your account to access your blogs and higher limits</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--fg-1)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{
                  borderColor: 'var(--border-1)',
                  backgroundColor: 'var(--bg-2)',
                  color: 'var(--fg-1)',
                  '--tw-ring-color': 'var(--accent)',
                } as React.CSSProperties}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--fg-1)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{
                  borderColor: 'var(--border-1)',
                  backgroundColor: 'var(--bg-2)',
                  color: 'var(--fg-1)',
                  '--tw-ring-color': 'var(--accent)',
                } as React.CSSProperties}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg border border-red-500" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: 'rgb(220, 38, 38)' }}>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg font-medium text-white transition-opacity disabled:opacity-50"
              style={{
                backgroundColor: 'var(--accent)',
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm" style={{ color: 'var(--fg-2)' }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--accent)' }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8" style={{ borderTopColor: 'var(--border-1)', borderTopWidth: '1px', color: 'var(--fg-2)' }}>
        <div className="max-w-7xl mx-auto py-3 text-center text-sm">
          <p>Made by <a href="https://sushilbang.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline', cursor: 'pointer' }}>Sushil</a></p>
        </div>
      </footer>
    </main>
  )
}
