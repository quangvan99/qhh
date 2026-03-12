'use client'

import Link from 'next/link'
import {
  BookOpen, Users, Camera, HelpCircle, Library, Settings,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { QuickShortcutItem } from '../types/dashboard.types'

const adminShortcuts: QuickShortcutItem[] = [
  { label: 'Quản lý lớp học', href: '/lms/classes', icon: <BookOpen className="h-6 w-6" />, module: 'lms' },
  { label: 'Người dùng', href: '/admin/users', icon: <Users className="h-6 w-6" />, module: 'admin' },
  { label: 'Điểm danh', href: '/attendance', icon: <Camera className="h-6 w-6" />, module: 'ai' },
  { label: 'Ngân hàng câu hỏi', href: '/exam/question-bank', icon: <HelpCircle className="h-6 w-6" />, module: 'exam' },
  { label: 'Thư viện', href: '/library', icon: <Library className="h-6 w-6" />, module: 'library' },
  { label: 'Cài đặt', href: '/admin/settings', icon: <Settings className="h-6 w-6" />, module: 'admin' },
]

const moduleColors: Record<string, string> = {
  lms: 'text-emerald-600 bg-emerald-50',
  exam: 'text-amber-600 bg-amber-50',
  ai: 'text-blue-600 bg-blue-50',
  library: 'text-purple-600 bg-purple-50',
  admin: 'text-slate-600 bg-slate-50',
}

export function QuickShortcuts() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Truy cập nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {adminShortcuts.map((shortcut) => (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              className="flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className={`rounded-lg p-2 ${moduleColors[shortcut.module ?? 'admin']}`}>
                {shortcut.icon}
              </div>
              <span className="text-xs font-medium text-center text-foreground">
                {shortcut.label}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
