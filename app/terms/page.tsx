'use client'

import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-8">Terms and Conditions</h1>
          <p className="text-sm" style={{ color: 'var(--fg-2)' }}>Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-12 space-y-8" style={{ color: 'var(--fg-1)' }}>
            {/* 1. Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                By accessing and using NeuralPost (the "Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            {/* 2. Use License */}
            <section>
              <h2 className="text-2xl font-bold mb-3">2. Use License</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                We grant you a limited, non-exclusive, non-transferable license to access and use NeuralPost for personal, non-commercial purposes. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2" style={{ color: 'var(--fg-2)' }}>
                <li>Reproduce, duplicate, or copy any content for commercial purposes</li>
                <li>Reverse engineer, decompile, or disassemble the Service</li>
                <li>Remove or alter any proprietary notices or labels</li>
                <li>Use the Service to generate illegal, harmful, or abusive content</li>
                <li>Attempt to gain unauthorized access to the Service</li>
              </ul>
            </section>

            {/* 3. User Accounts */}
            <section>
              <h2 className="text-2xl font-bold mb-3">3. User Accounts</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                When you create an account with NeuralPost, you are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2" style={{ color: 'var(--fg-2)' }}>
                <li>Providing accurate and complete registration information</li>
                <li>Maintaining the confidentiality of your password</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
            </section>

            {/* 4. Content Standards */}
            <section>
              <h2 className="text-2xl font-bold mb-3">4. Content Standards</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                NeuralPost has a zero-tolerance policy for harmful content. The following content is strictly prohibited:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2" style={{ color: 'var(--fg-2)' }}>
                <li>Explicit sexual or adult content</li>
                <li>Hate speech, discrimination, or dehumanizing language</li>
                <li>Violence, gore, or graphic content</li>
                <li>Abusive, profane, or vulgar language</li>
                <li>Harassment, bullying, or threats</li>
                <li>Content promoting illegal activities or harm</li>
                <li>Misinformation or false health/medical claims</li>
                <li>Content violating intellectual property rights</li>
              </ul>
              <p className="mt-3" style={{ color: 'var(--fg-2)' }}>
                We reserve the right to refuse service to users who violate these standards.
              </p>
            </section>

            {/* 5. Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold mb-3">5. Intellectual Property Rights</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                The Service and its original content (including but not limited to software, design, text, and graphics) are the exclusive property of NeuralPost and its content suppliers. The Service is protected by copyright, trademark, and other laws.
              </p>
            </section>

            {/* 6. Generated Content */}
            <section>
              <h2 className="text-2xl font-bold mb-3">6. Generated Content Ownership</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                Content generated through NeuralPost is created using AI technology. You retain the rights to the output of the Service. However, you are responsible for ensuring that the generated content does not violate any laws or third-party rights.
              </p>
            </section>

            {/* 7. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold mb-3">7. Limitation of Liability</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                NeuralPost is provided "as is" without warranties of any kind. To the fullest extent permissible by law, NeuralPost shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
              </p>
            </section>

            {/* 8. Indemnification */}
            <section>
              <h2 className="text-2xl font-bold mb-3">8. Indemnification</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                You agree to indemnify, defend, and hold harmless NeuralPost and its affiliates from any claims, damages, or losses arising from your use of the Service or violation of these Terms and Conditions.
              </p>
            </section>

            {/* 9. Modifications to Service */}
            <section>
              <h2 className="text-2xl font-bold mb-3">9. Modifications to Service</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                NeuralPost reserves the right to modify or discontinue the Service at any time. We will make reasonable efforts to notify users of significant changes.
              </p>
            </section>

            {/* 10. Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold mb-3">10. Changes to Terms and Conditions</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                NeuralPost may update these Terms and Conditions at any time. Your continued use of the Service constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* 11. Governing Law */}
            <section>
              <h2 className="text-2xl font-bold mb-3">11. Governing Law</h2>
              <p className="mb-3" style={{ color: 'var(--fg-2)' }}>
                These Terms and Conditions are governed by and construed in accordance with the laws of applicable jurisdiction.
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
