'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, PenLine, Trophy, User, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotificationStore } from '@/stores/notification.store'
import { useEffect } from 'react'
import { adminMockApi } from '@/lib/mock'

interface BottomNavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  activeRoutes?: string[]
}

const bottomNavItems: BottomNavItem[] = [
  {
    label: 'Home',
    href: '/hocsinh/home',
    icon: Home,
    activeRoutes: ['/hocsinh/home'],
  },
  {
    label: 'Học',
    href: '/hocsinh/hoc-tap',
    icon: BookOpen,
    activeRoutes: ['/hocsinh/hoc-tap'],
  },
  {
    label: 'Bài',
    href: '/hocsinh/bai-tap',
    icon: PenLine,
    activeRoutes: ['/hocsinh/bai-tap', '/hocsinh/thi'],
  },
  {
    label: 'Điểm',
    href: '/hocsinh/ket-qua',
    icon: Trophy,
    activeRoutes: ['/hocsinh/ket-qua', '/hocsinh/diem-danh'],
  },
  {
    label: 'Hồ sơ',
    href: '/hocsinh/ho-so',
    icon: User,
    activeRoutes: ['/hocsinh/ho-so'],
  },
]

function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg"
      aria-label="Điều hướng chính"
    >
      {bottomNavItems.map(item => {
        const Icon = item.icon
        const isActive =
          item.activeRoutes?.some(r => pathname.startsWith(r)) ??
          pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={cn('relative rounded-lg p-1 transition-all', isActive && 'bg-primary/10')}>
              <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.5]')} />
            </div>
            <span className={cn('text-[10px] font-medium', isActive && 'font-semibold')}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

function HSHeader() {
  const { unreadCount, notifications, setNotifications, markAllAsRead } = useNotificationStore()

  useEffect(() => {
    adminMockApi.getNotifications().then(setNotifications)
  }, [setNotifications])

  return (
    <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4">
      {/* Logo */}
      <Link href="/hocsinh/home" className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
          QH
        </div>
        <span className="text-sm font-semibold">Quốc Học Huế</span>
      </Link>

      {/* Notification bell */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" className="relative h-8 w-8" />}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] text-white font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Thông báo</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-primary hover:underline font-normal">
                Đọc tất cả
              </button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.slice(0, 5).map(n => (
            <DropdownMenuItem
              key={n.id}
              className={cn('flex flex-col items-start gap-0.5 py-2', !n.read && 'bg-muted/50')}
            >
              <div className="flex items-start gap-2 w-full">
                {!n.read && (
                  <Badge variant="destructive" className="h-1.5 w-1.5 rounded-full p-0 mt-1.5 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm line-clamp-1">{n.title}</span>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          {notifications.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">Không có thông báo</p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default function HocsinhLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide bottom nav and header on exam page (immersive mode)
  const isExamPage = pathname.includes('/thi/') && !pathname.endsWith('/thi')

  if (isExamPage) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Compact header */}
      <HSHeader />

      {/* Page content — pad bottom for bottom nav */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  )
}
