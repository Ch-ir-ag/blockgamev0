import './globals.css'
import { Inter } from 'next/font/google'
import SupabaseProvider from '@/components/providers/supabase-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Block Guesser',
  description: 'A Next.js application with Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
