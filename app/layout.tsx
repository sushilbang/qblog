import type { Metadata } from 'next'
import { ThemeProvider } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'NeuralPost - Blog Like a Boss with AI',
  description: 'Snappy, stunning posts in seconds — because your ideas deserve swagger, not sweat.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75" fill="black">🧠</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
