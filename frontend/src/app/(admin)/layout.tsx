'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Scan,
  Library,
  MonitorPlay,
  ClipboardList,
  BarChart3,
  Settings,
  ChevronRight,
  LogOut,
  Bell,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSession } from 'next-auth/react'
import { useNotificationStore } from '@/stores/notification.store'
import { useState, useEffect } from 'react'
import { adminMockApi } from '@/lib/mock'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Tổng quan',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Quản lý',
    items: [
      { label: 'Giáo viên', href: '/admin/giao-vien', icon: Users },
      { label: 'Học sinh', href: '/admin/hoc-sinh', icon: GraduationCap },
      { label: 'Lớp học', href: '/admin/lop-hoc', icon: BookOpen },
      { label: 'Nhà trường', href: '/admin/truong', icon: Building2 },
    ],
  },
  {
    title: 'Dịch vụ',
    items: [
      { label: 'Điểm danh AI', href: '/admin/diem-danh', icon: Scan },
      { label: 'Thư viện', href: '/admin/thu-vien', icon: Library },
      { label: 'E-Learning', href: '/admin/e-learning', icon: MonitorPlay },
      { label: 'Thi & Kiểm tra', href: '/admin/thi', icon: ClipboardList },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      { label: 'Báo cáo', href: '/admin/bao-cao', icon: BarChart3 },
      { label: 'Cài đặt', href: '/admin/he-thong', icon: Settings },
    ],
  },
]

function NavLink({ item, collapsed = false }: { item: NavItem; collapsed?: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        collapsed && 'justify-center px-2'
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <Badge variant="destructive" className="h-4 min-w-4 px-1 text-[10px]">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  )
}

function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn('flex h-14 items-center border-b px-4', collapsed && 'justify-center px-2')}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
          QH
        </div>
        {!collapsed && (
          <div className="ml-2.5 min-w-0">
            <p className="text-sm font-semibold leading-none truncate">Quốc Học Huế</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Quản trị hệ thống</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map(group => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavLink key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className={cn('border-t p-2', collapsed && 'flex justify-center')}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors',
            collapsed && 'w-auto justify-center px-2'
          )}
          title={collapsed ? 'Đăng xuất' : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  )
}

function AdminHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { unreadCount, notifications, setNotifications, markAllAsRead } = useNotificationStore()

  useEffect(() => {
    adminMockApi.getNotifications().then(setNotifications)
  }, [setNotifications])

  // Build breadcrumb from pathname
  const segments = pathname.replace('/admin/', '').split('/').filter(Boolean)
  const breadcrumbMap: Record<string, string> = {
    dashboard: 'Dashboard',
    'giao-vien': 'Giáo viên',
    'hoc-sinh': 'Học sinh',
    'lop-hoc': 'Lớp học',
    truong: 'Nhà trường',
    'diem-danh': 'Điểm danh AI',
    'thu-vien': 'Thư viện',
    'e-learning': 'E-Learning',
    thi: 'Thi & Kiểm tra',
    'bao-cao': 'Báo cáo',
    'he-thong': 'Hệ thống',
  }

  const userName = session?.user?.name ?? 'Admin'
  const initials = userName.split(' ').map((n: string) => n[0]).slice(-2).join('').toUpperCase()

  return (
    <header className="flex h-14 items-center gap-4 border-b px-4 lg:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors lg:hidden">
          <Menu className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm min-w-0 flex-1" aria-label="Breadcrumb">
        <span className="text-muted-foreground shrink-0">Admin</span>
        {segments.map((seg, i) => (
          <span key={seg} className="flex items-center gap-1 min-w-0">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span
              className={cn(
                'truncate',
                i === segments.length - 1 ? 'font-medium text-foreground' : 'text-muted-foreground'
              )}
            >
              {breadcrumbMap[seg] ?? seg}
            </span>
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Thông báo</span>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-primary hover:underline font-normal">
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.slice(0, 5).map(n => (
              <DropdownMenuItem key={n.id} className={cn('flex flex-col items-start gap-0.5 py-2.5', !n.read && 'bg-muted/50')}>
                <span className={cn('font-medium text-sm', !n.read && 'text-foreground')}>{n.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-2">{n.body}</span>
              </DropdownMenuItem>
            ))}
            {notifications.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">Không có thông báo</p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 items-center gap-2 rounded-md px-2 hover:bg-muted transition-colors">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-flex text-sm font-medium max-w-[100px] truncate">{userName}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="font-medium">{userName}</div>
              <div className="text-xs text-muted-foreground font-normal">{session?.user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
            <DropdownMenuItem>Cài đặt</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r bg-card">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
