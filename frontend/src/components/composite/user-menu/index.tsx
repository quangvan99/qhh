'use client'
import { User, KeyRound, LogOut } from 'lucide-react'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { UserRole } from '@/components/base/app-badge'

export interface UserMenuUser {
  name: string
  email: string
  avatar?: string
  role: UserRole
}

const roleLabels: Record<UserRole, string> = {
  student: 'Học sinh', teacher: 'Giáo viên', principal: 'Hiệu trưởng',
  admin: 'Quản trị viên', librarian: 'Thủ thư', staff: 'Nhân viên',
}

export interface UserMenuProps {
  user: UserMenuUser
  onSignOut: () => void
  onProfile?: () => void
  onChangePassword?: () => void
}

export function UserMenu({ user, onSignOut, onProfile, onChangePassword }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-9 w-9 rounded-full p-0 cursor-pointer" aria-label="Tài khoản người dùng">
            <AppAvatar name={user.name} src={user.avatar} role={user.role} size="sm" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3 py-1">
              <AppAvatar name={user.name} src={user.avatar} role={user.role} size="md" />
              <div className="flex flex-col gap-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <AppBadge role={user.role} size="sm">{roleLabels[user.role]}</AppBadge>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onProfile} className="cursor-pointer gap-2">
            <User className="h-4 w-4" /> Hồ sơ của tôi
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onChangePassword} className="cursor-pointer gap-2">
            <KeyRound className="h-4 w-4" /> Đổi mật khẩu
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onSignOut} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4" /> Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
