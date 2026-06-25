import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { NetworkProvider } from '@/components/providers/network-provider'
import { WalletProvider } from '@/components/providers/wallet-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'FlowStar — Stream tokens by the second on Stellar',
    template: '%s | FlowStar',
  },
  description:
    'Stream tokens by the second on Stellar. Create vesting schedules, payroll, and grants that unlock continuously — withdraw anytime, cancel anytime.',
  metadataBase: new URL('https://flowstar.app'),
  openGraph: {
    type: 'website',
    siteName: 'FlowStar',
    title: 'FlowStar — Stream tokens by the second on Stellar',
    description:
      'Stream tokens by the second on Stellar. Create vesting schedules, payroll, and grants that unlock continuously — withdraw anytime, cancel anytime.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FlowStar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlowStar — Stream tokens by the second on Stellar',
    description:
      'Stream tokens by the second on Stellar. Create vesting schedules, payroll, and grants that unlock continuously — withdraw anytime, cancel anytime.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0c1014',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NetworkProvider>
            <WalletProvider>
              {children}
              <Toaster position="top-right" />
            </WalletProvider>
          </NetworkProvider>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
