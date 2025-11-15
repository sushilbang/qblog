'use client'

import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-sm" style={{ color: 'var(--fg-2)' }}>Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-12 space-y-8" style={{ color: 'var(--fg-1)' }}>
            {/* 1. Introduction */}
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
              <p style={{ color: 'var(--fg-2)' }}>
                NeuralPost ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                We collect information in various ways:
              </p>
              <h3 className="text-lg font-semibold mb-2">Information You Provide:</h3>
              <ul className="list-disc list-inside space-y-2 ml-2 mb-4" style={{ color: 'var(--fg-2)' }}>
                <li>Account registration information (email, password)</li>
                <li>Blog generation queries and content</li>
                <li>Custom system prompts</li>
                <li>User preferences and settings</li>
              </ul>
              <h3 className="text-lg font-semibold mb-2">Information Collected Automatically:</h3>
              <ul className="list-disc list-inside space-y-2 ml-2" style={{ color: 'var(--fg-2)' }}>
                <li>IP address and geolocation data</li>
                <li>User agent and browser information</li>
                <li>Device type and operating system</li>
                <li>Usage patterns and interaction data</li>
                <li>Timestamps and access logs</li>
              </ul>
            </section>

            {/* 3. How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold mb-3">3. How We Use Your Information</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2" style={{ color: 'var(--fg-2)' }}>
                <li>Provide and maintain the Service</li>
                <li>Process your account registration and authentication</li>
                <li>Generate AI-powered blog content</li>
                <li>Implement and enforce rate limiting policies</li>
                <li>Monitor and analyze usage trends and service performance</li>
                <li>Detect and prevent abuse and fraudulent activity</li>
                <li>Improve the quality and functionality of our Service</li>
                <li>Communicate with you about service updates</li>
              </ul>
            </section>

            {/* 4. Data Sharing and Disclosure */}
            <section>
              <h2 className="text-2xl font-bold mb-3">4. Data Sharing and Disclosure</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                We do not sell, trade, or rent your personal information. However, we may share information in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2" style={{ color: 'var(--fg-2)' }}>
                <li>With Firebase services for authentication and database operations</li>
                <li>With Groq API for AI-powered content generation</li>
                <li>When required by law or legal process</li>
                <li>To protect our legal rights and prevent fraud</li>
                <li>To service providers who assist in our operations</li>
              </ul>
            </section>

            {/* 5. Data Security */}
            <section>
              <h2 className="text-2xl font-bold mb-3">5. Data Security</h2>
              <p style={{ color: 'var(--fg-2)' }}>
                We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure authentication, and regular security assessments. However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.
              </p>
            </section>

            {/* 6. Retention of Data */}
            <section>
              <h2 className="text-2xl font-bold mb-3">6. Retention of Data</h2>
              <p style={{ color: 'var(--fg-2)' }}>
                We retain personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. You may request deletion of your account and associated data at any time, subject to applicable legal requirements.
              </p>
            </section>

            {/* 7. User Rights */}
            <section>
              <h2 className="text-2xl font-bold mb-3">7. Your Rights</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2" style={{ color: 'var(--fg-2)' }}>
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to request deletion of your data</li>
                <li>Right to data portability</li>
                <li>Right to opt-out of certain data processing</li>
              </ul>
            </section>

            {/* 8. Third-Party Links */}
            <section>
              <h2 className="text-2xl font-bold mb-3">8. Third-Party Links</h2>
              <p style={{ color: 'var(--fg-2)' }}>
                Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            {/* 9. Cookies */}
            <section>
              <h2 className="text-2xl font-bold mb-3">9. Cookies and Tracking</h2>
              <p style={{ color: 'var(--fg-2)' }}>
                We use cookies and similar tracking technologies to enhance your experience and collect usage data. You can control cookie settings through your browser preferences.
              </p>
            </section>

            {/* 10. International Data Transfers */}
            <section>
              <h2 className="text-2xl font-bold mb-3">10. International Data Transfers</h2>
              <p style={{ color: 'var(--fg-2)' }}>
                Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws that differ from your home country. By using NeuralPost, you consent to the transfer of your information as described in this Privacy Policy.
              </p>
            </section>

            {/* 11. Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold mb-3">11. Children's Privacy</h2>
              <p style={{ color: 'var(--fg-2)' }}>
                NeuralPost is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete such information promptly.
              </p>
            </section>

            {/* 12. Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-bold mb-3">12. Changes to This Privacy Policy</h2>
              <p style={{ color: 'var(--fg-2)' }}>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on our website. Your continued use of the Service constitutes acceptance of the revised Privacy Policy.
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
