import type { Metadata, ReactNode } from 'react'
import { Navbar } from '@/components/layout/navbar'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your active and historical token streams on Stellar.',
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  )
}
