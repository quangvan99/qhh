import type { Metadata } from 'next'
import { Lexend, Source_Sans_3 } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'
import { auth } from '@/lib/auth'

const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-lexend',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600'],
  variable: '--font-source-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'THPT Quốc Học Huế',
  description: 'Hệ thống quản lý trường học THPT Quốc Học Huế',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth().catch(() => null)
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${lexend.variable} ${sourceSans.variable} font-sans antialiased`}>
        <Providers session={session}>
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
