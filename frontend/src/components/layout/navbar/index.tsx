'use client'
import Link from 'next/link'
import { Menu, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { UserMenu } from '@/components/composite/user-menu'
import { useUIStore } from '@/stores/ui.store'
import type { UserMenuUser } from '@/components/composite/user-menu'

export interface NavbarProps {
  user?: UserMenuUser
  onSignOut?: () => void
  notificationCount?: number
}

export function Navbar({ user, onSignOut, notificationCount = 0 }: NavbarProps) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-20 bg-background border-b flex items-center px-4 gap-4">
      {/* Sidebar toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="cursor-pointer h-9 w-9 p-0"
        aria-label="Đóng/mở thanh điều hướng"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
          QH
        </div>
        <span className="font-semibold text-teal-700 hidden sm:block text-sm leading-tight">
          THPT Quốc Học Huế
        </span>
      </Link>

      <div className="flex-1" />

      {/* Notification bell */}
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="ghost" size="sm" className="cursor-pointer h-9 w-9 p-0 relative" aria-label={`${notificationCount} thông báo`}>
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
          }
        />
        <PopoverContent align="end" className="w-80">
          <div className="py-2 px-1">
            <p className="text-sm font-semibold px-2 mb-2">Thông báo</p>
            <p className="text-sm text-muted-foreground text-center py-6">Không có thông báo mới</p>
            <div className="border-t pt-2 mt-2">
              <Link href="/notifications" className="text-sm text-primary hover:underline block text-center cursor-pointer">
                Xem tất cả thông báo
              </Link>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* User menu */}
      {user && onSignOut && (
        <UserMenu user={user} onSignOut={onSignOut} />
      )}
    </header>
  )
}
