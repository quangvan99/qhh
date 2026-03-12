'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, ClipboardList, Camera, Library, Settings, ChevronDown, ChevronRight,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useUIStore } from '@/stores/ui.store'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { UserRole } from '@/components/base/app-badge'
import type { LucideIcon } from 'lucide-react'

interface NavChild { label: string; href: string; roles: string[] }
interface NavItem {
  label: string
  href?: string
  icon: LucideIcon
  module?: string
  roles: string[]
  children?: NavChild[]
}

const moduleAccent: Record<string, string> = {
  lms: 'border-l-emerald-500 bg-emerald-50 text-emerald-700',
  exam: 'border-l-amber-500 bg-amber-50 text-amber-700',
  ai: 'border-l-blue-500 bg-blue-50 text-blue-700',
  library: 'border-l-purple-500 bg-purple-50 text-purple-700',
  admin: 'border-l-slate-500 bg-slate-50 text-slate-700',
}

const navItems: NavItem[] = [
  { label: 'Tổng quan', href: '/', icon: LayoutDashboard, roles: ['all'] },
  {
    label: 'Học tập', icon: BookOpen, module: 'lms', roles: ['teacher', 'student', 'admin', 'principal'],
    children: [
      { label: 'Lớp học', href: '/lms/classes', roles: ['teacher', 'admin'] },
      { label: 'Lớp của tôi', href: '/my-classes', roles: ['student'] },
      { label: 'Bài thi của tôi', href: '/my-exams', roles: ['student'] },
      { label: 'GDĐT', href: '/gddt/classes', roles: ['admin', 'teacher'] },
    ],
  },
  {
    label: 'Thi & Kiểm tra', icon: ClipboardList, module: 'exam', roles: ['teacher', 'admin'],
    children: [
      { label: 'Ngân hàng câu hỏi', href: '/exam/question-bank', roles: ['teacher', 'admin'] },
      { label: 'Đề thi', href: '/exam/exams', roles: ['teacher', 'admin'] },
      { label: 'Tổ chức thi', href: '/exam/sessions', roles: ['teacher', 'admin'] },
    ],
  },
  { label: 'AI Điểm danh', href: '/ai-attendance', icon: Camera, module: 'ai', roles: ['admin', 'principal'] },
  {
    label: 'Thư viện', icon: Library, module: 'library', roles: ['admin', 'librarian', 'teacher', 'student'],
    children: [
      { label: 'Quản lý thư viện', href: '/library', roles: ['admin', 'librarian'] },
      { label: 'Tra cứu sách', href: '/library-portal/opac', roles: ['all'] },
    ],
  },
  {
    label: 'Quản trị', icon: Settings, module: 'admin', roles: ['admin'],
    children: [
      { label: 'Người dùng', href: '/admin/users', roles: ['admin'] },
      { label: 'Vai trò', href: '/admin/roles', roles: ['admin'] },
      { label: 'Cơ cấu tổ chức', href: '/admin/organization', roles: ['admin'] },
      { label: 'Cài đặt', href: '/admin/settings/general', roles: ['admin'] },
      { label: 'Audit Log', href: '/admin/audit-log', roles: ['admin'] },
      { label: 'Tích hợp', href: '/admin/integrations', roles: ['admin'] },
    ],
  },
]

function hasAccess(roles: string[], userRole?: UserRole) {
  if (!userRole) return false
  return roles.includes('all') || roles.includes(userRole)
}

export function Sidebar({ userRole }: { userRole?: UserRole }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (label: string) => setOpenGroups((p) => ({ ...p, [label]: !p[label] }))
  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <TooltipProvider delay={0}>
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r flex flex-col overflow-y-auto transition-all duration-200 z-10',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <nav className="flex-1 py-2 px-2" aria-label="Điều hướng chính">
          {navItems.map((item) => {
            if (!hasAccess(item.roles, userRole)) return null
            const Icon = item.icon
            const isGroupOpen = openGroups[item.label] ?? false

            if (item.children) {
              const visibleChildren = item.children.filter((c) => hasAccess(c.roles, userRole))
              if (visibleChildren.length === 0) return null
              const anyChildActive = visibleChildren.some((c) => isActive(c.href))

              return (
                <div key={item.label}>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          onClick={() => toggleGroup(item.label)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 cursor-pointer',
                            anyChildActive ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          )}
                          aria-expanded={isGroupOpen}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left">{item.label}</span>
                              {isGroupOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </>
                          )}
                        </button>
                      }
                    />
                    {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                  {!collapsed && (isGroupOpen || anyChildActive) && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l pl-2">
                      {visibleChildren.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center px-3 py-1.5 rounded-md text-sm transition-colors duration-150 cursor-pointer border-l-2',
                            isActive(child.href)
                              ? cn('border-l-2 font-medium', item.module ? moduleAccent[item.module] : 'border-l-primary bg-primary/5 text-primary')
                              : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            // Single item
            const active = isActive(item.href!)
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger
                  render={
                    <Link
                      href={item.href!}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 cursor-pointer border-l-2',
                        active
                          ? cn('font-medium border-l-2', item.module ? moduleAccent[item.module] : 'border-l-primary bg-primary/5 text-primary')
                          : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  }
                />
                {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            )
          })}
        </nav>
      </aside>
    </TooltipProvider>
  )
}
