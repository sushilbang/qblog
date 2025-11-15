'use client'

import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-1)', color: 'var(--fg-1)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4" style={{ borderBottomColor: 'var(--border-1)', borderBottomWidth: '1px', backgroundColor: 'var(--bg-1)' }}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--fg-1)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article>
          <h1 className="text-4xl sm:text-5xl font-bold mb-8">About NeuralPost</h1>

          <div className="mt-12 space-y-8" style={{ color: 'var(--fg-1)' }}>
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold mb-4">What is NeuralPost?</h2>
              <p className="mb-4" style={{ color: 'var(--fg-2)' }}>
                NeuralPost is an AI-powered blog generation platform designed to help creators, marketers, and writers generate high-quality, engaging blog content in seconds. Powered by cutting-edge AI technology, NeuralPost transforms simple prompts into fully-formed, publication-ready blog posts.
              </p>
              <p style={{ color: 'var(--fg-2)' }}>
                Whether you're looking to kickstart your content marketing strategy, overcome writer's block, or simply save time on content creation, NeuralPost is here to help you write smarter, faster, and better.
              </p>
            </section>

            {/* Our Mission */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p style={{ color: 'var(--fg-2)' }}>
                We believe that everyone should have access to powerful tools that make content creation effortless. Our mission is to democratize AI-powered content generation by providing an intuitive, safe, and ethical platform that empowers creators to focus on what matters most—their ideas and their audience.
              </p>
            </section>

            {/* Our Values */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-2)', borderColor: 'var(--border-1)', borderWidth: '1px' }}>
                  <h3 className="font-semibold mb-2">Quality First</h3>
                  <p style={{ color: 'var(--fg-2)' }}>We are committed to generating high-quality, engaging, and authentic content that resonates with readers.</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-2)', borderColor: 'var(--border-1)', borderWidth: '1px' }}>
                  <h3 className="font-semibold mb-2">Safety & Ethics</h3>
                  <p style={{ color: 'var(--fg-2)' }}>We implement strict content moderation and ethical guidelines to ensure our platform is used responsibly.</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-2)', borderColor: 'var(--border-1)', borderWidth: '1px' }}>
                  <h3 className="font-semibold mb-2">User Empowerment</h3>
                  <p style={{ color: 'var(--fg-2)' }}>We give users control over their content through customizable prompts and full ownership of generated material.</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-2)', borderColor: 'var(--border-1)', borderWidth: '1px' }}>
                  <h3 className="font-semibold mb-2">Privacy Protection</h3>
                  <p style={{ color: 'var(--fg-2)' }}>Your data is your own. We prioritize privacy and never sell user information to third parties.</p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="space-y-3" style={{ color: 'var(--fg-2)' }}>
                <li className="flex gap-3">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span><strong>AI-Powered Generation:</strong> Leverages advanced language models to create engaging content</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span><strong>Custom Prompts:</strong> Tailor the AI's writing style to match your brand voice</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span><strong>AI-Generated Images:</strong> Automatic banner image generation to complement your content</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span><strong>Content Library:</strong> Browse and explore generated blogs from the community</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span><strong>Easy Editing:</strong> Edit and refine generated content to perfection</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span><strong>User Accounts:</strong> Save your custom prompts and blog history</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--accent)] font-bold">✓</span>
                  <span><strong>Content Moderation:</strong> Strict safety guidelines to ensure ethical content generation</span>
                </li>
              </ul>
            </section>

            {/* How It Works */}
            <section>
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent)', color: 'white', fontWeight: 'bold' }}>1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Enter Your Topic</h3>
                    <p style={{ color: 'var(--fg-2)' }}>Simply describe what you'd like to write about</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent)', color: 'white', fontWeight: 'bold' }}>2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Customize (Optional)</h3>
                    <p style={{ color: 'var(--fg-2)' }}>Set a custom prompt to guide the AI's writing style</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent)', color: 'white', fontWeight: 'bold' }}>3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Generate</h3>
                    <p style={{ color: 'var(--fg-2)' }}>AI creates a complete blog post with title, content, and featured image</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent)', color: 'white', fontWeight: 'bold' }}>4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Edit & Publish</h3>
                    <p style={{ color: 'var(--fg-2)' }}>Fine-tune the content and make it your own before publishing</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Technology */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
              <p className="mb-4" style={{ color: 'var(--fg-2)' }}>
                NeuralPost is built on a modern technology stack to ensure reliability, speed, and scalability:
              </p>
              <div className="grid md:grid-cols-2 gap-4" style={{ color: 'var(--fg-2)' }}>
                <div>
                  <h3 className="font-semibold mb-2">Backend</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Next.js with TypeScript</li>
                    <li>Firebase (Firestore, Auth)</li>
                    <li>Groq API for AI Generation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Frontend</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>React with TypeScript</li>
                    <li>Tailwind CSS</li>
                    <li>Lucide React Icons</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Creator */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About the Creator</h2>
              <p style={{ color: 'var(--fg-2)' }}>
                NeuralPost was created by <a href="https://sushilbang.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Sushil Bang</a>, a passionate developer and entrepreneur focused on leveraging AI to create tools that empower creators and streamline workflows.
              </p>
            </section>

          </div>
        </article>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
