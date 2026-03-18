'use client'

import { signIn } from 'next-auth/react'
import { Separator } from '@/components/ui/separator'

interface QuickLoginConfig {
  label: string
  username: string
  password: string
  color: string
  role: string
}

const quickLogins: QuickLoginConfig[] = [
  {
    label: '→ Admin',
    role: 'Quản trị viên',
    username: 'admin',
    password: 'admin123',
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200',
  },
  {
    label: '→ Giáo viên',
    role: 'Giáo viên',
    username: 'teacher',
    password: 'teacher123',
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200',
  },
  {
    label: '→ Học sinh',
    role: 'Học sinh',
    username: 'student',
    password: 'student123',
    color: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200',
  },
]

export function QuickLoginButtons() {
  // Only show in development
  if (process.env.NODE_ENV === 'production') return null

  const handleQuickLogin = async (username: string, password: string) => {
    await signIn('credentials', { username, password, redirect: true, callbackUrl: '/' })
  }

  return (
    <div className="mt-6">
      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-muted-foreground whitespace-nowrap">
          🛠 Dev Quick Login
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {quickLogins.map(({ label, username, password, color, role }) => (
          <button
            key={username}
            type="button"
            onClick={() => handleQuickLogin(username, password)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${color}`}
            title={`Đăng nhập với ${role}\n${username}:${password}`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">
        Chỉ hiển thị trong môi trường development
      </p>
    </div>
  )
}
