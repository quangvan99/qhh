'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AppShell } from '@/components/layout/app-shell'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-3 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    )
  }

  const shellUser = user
    ? {
        name: user.name ?? 'Người dùng',
        email: user.email ?? '',
        role: (user.role as 'admin' | 'teacher' | 'student') ?? 'admin',
      }
    : {
        name: 'Khách',
        email: '',
        role: 'admin' as const,
      }

  return (
    <AppShell user={shellUser} onSignOut={signOut}>
      {children}
    </AppShell>
  )
}
