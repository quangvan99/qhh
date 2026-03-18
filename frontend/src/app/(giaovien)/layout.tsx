'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Scan,
  FileText,
  PenLine,
  HelpCircle,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  Library,
  Bell,
  LogOut,
  Menu,
  ChevronRight,
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
import { useClassStore } from '@/stores/class.store'
import { ClassSwitcher } from '@/components/shared/ClassSwitcher'
import { useEffect, useState } from 'react'
import { teacherMockApi, adminMockApi } from '@/lib/mock'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface NavGroup {
  title?: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', href: '/giaovien/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Lớp học',
    items: [
      { label: 'Lớp của tôi', href: '/giaovien/lop-hoc', icon: BookOpen },
      { label: 'Điểm danh', href: '/giaovien/diem-danh', icon: Scan },
    ],
  },
  {
    title: 'Nội dung',
    items: [
      { label: 'Khóa học', href: '/giaovien/noi-dung', icon: FileText },
      { label: 'Bài tập', href: '/giaovien/bai-tap', icon: PenLine },
      { label: 'Ngân hàng câu hỏi', href: '/giaovien/cau-hoi', icon: HelpCircle },
      { label: 'Thi & Kiểm tra', href: '/giaovien/thi', icon: ClipboardList },
    ],
  },
  {
    title: 'Đánh giá',
    items: [
      { label: 'Kết quả', href: '/giaovien/ket-qua', icon: TrendingUp },
      { label: 'Thảo luận', href: '/giaovien/thao-luan', icon: MessageSquare },
    ],
  },
  {
    title: 'Tiện ích',
    items: [
      { label: 'Thư viện', href: '/giaovien/thu-vien', icon: Library },
    ],
  },
]

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Dashboard',
  'lop-hoc': 'Lớp học',
  'diem-danh': 'Điểm danh',
  'noi-dung': 'Khóa học',
  'bai-tap': 'Bài tập',
  'cau-hoi': 'Ngân hàng câu hỏi',
  thi: 'Thi & Kiểm tra',
  'ket-qua': 'Kết quả',
  'thao-luan': 'Thảo luận',
  'thu-vien': 'Thư viện',
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <Badge variant="destructive" className="h-4 min-w-4 px-1 text-[10px]">
          {item.badge}
        </Badge>
      )}
    </Link>
  )
}

interface ClassOption {
  id: string
  name: string
  subject: string
  studentCount: number
  hasAlert?: boolean
}

function GVSidebarContent() {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shrink-0">
          QH
        </div>
        <div className="ml-2.5">
          <p className="text-sm font-semibold leading-none">Quốc Học Huế</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Giáo viên</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-3">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.title && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t p-2">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}

function GVHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { unreadCount, notifications, setNotifications, markAllAsRead } = useNotificationStore()
  const { currentClassId, setCurrentClass } = useClassStore()
  const [classes, setClasses] = useState<ClassOption[]>([])

  const teacherId = 'gv-001' // In production: session?.user?.id

  useEffect(() => {
    adminMockApi.getNotifications().then(setNotifications)
    teacherMockApi.getMyClasses(teacherId).then((cls) =>
      setClasses(
        cls.map(c => ({
          id: c.id,
          name: c.name,
          subject: c.subject,
          studentCount: c.studentCount,
        }))
      )
    )
  }, [setNotifications])

  // Auto-select first class
  useEffect(() => {
    if (classes.length > 0 && !currentClassId) {
      const first = classes[0]
      if (first) setCurrentClass(first.id)
    }
  }, [classes, currentClassId, setCurrentClass])

  const segments = pathname.replace('/giaovien/', '').split('/').filter(Boolean)
  const userName = session?.user?.name ?? 'Giáo viên'
  const initials = userName.split(' ').map((n: string) => n[0]).slice(-2).join('').toUpperCase()

  return (
    <header className="flex h-14 items-center gap-3 border-b px-4">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors lg:hidden">
          <Menu className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-52 p-0">
          <GVSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm min-w-0 flex-1" aria-label="Breadcrumb">
        <span className="text-muted-foreground shrink-0">GV</span>
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

      {/* Class Switcher */}
      <ClassSwitcher
        classes={classes}
        currentClassId={currentClassId}
        onChange={setCurrentClass}
        isLoading={classes.length === 0}
      />

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
          {notifications.slice(0, 4).map(n => (
            <DropdownMenuItem
              key={n.id}
              className={cn('flex flex-col items-start gap-0.5 py-2', !n.read && 'bg-muted/50')}
            >
              <span className="font-medium text-sm">{n.title}</span>
              <span className="text-xs text-muted-foreground line-clamp-1">{n.body}</span>
            </DropdownMenuItem>
          ))}
          {notifications.length === 0 && (
            <p className="py-3 text-center text-sm text-muted-foreground">Không có thông báo</p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6" />

      {/* User */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-8 items-center gap-2 rounded-md px-2 hover:bg-muted transition-colors">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium max-w-[80px] truncate">{userName}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="font-medium">{userName}</div>
            <div className="text-xs text-muted-foreground font-normal">{session?.user?.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })} className="text-destructive">
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default function GiaovienLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar — slimmer than admin */}
      <aside className="hidden lg:flex w-52 shrink-0 flex-col border-r bg-card">
        <GVSidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <GVHeader />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
