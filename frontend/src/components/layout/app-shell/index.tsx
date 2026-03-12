'use client'
import { useUIStore } from '@/stores/ui.store'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { cn } from '@/lib/utils'
import type { UserMenuUser } from '@/components/composite/user-menu'

export interface AppShellProps {
  children: React.ReactNode
  user?: UserMenuUser
  onSignOut?: () => void
}

export function AppShell({ children, user, onSignOut }: AppShellProps) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onSignOut={onSignOut} />
      <div className="flex pt-16">
        <Sidebar userRole={user?.role} />
        <main
          className={cn(
            'flex-1 transition-all duration-200 min-h-[calc(100vh-4rem)] p-6',
            collapsed ? 'ml-16' : 'ml-64'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
