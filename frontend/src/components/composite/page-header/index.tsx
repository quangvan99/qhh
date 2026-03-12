'use client'
import Link from 'next/link'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem { label: string; href?: string }
export interface PageAction {
  label: string
  onClick?: () => void
  href?: string
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  icon?: React.ReactNode
  loading?: boolean
  disabled?: boolean
}
export interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: PageAction[]
  className?: string
}

export function PageHeader({ title, subtitle, breadcrumbs, actions = [], className }: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-foreground transition-colors cursor-pointer">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop: show all actions */}
            <div className="hidden md:flex items-center gap-2">
              {actions.map((action, i) => (
                <ActionButton key={i} action={action} />
              ))}
            </div>
            {/* Mobile: first action visible, rest in dropdown */}
            <div className="flex md:hidden items-center gap-2">
              {actions.slice(0, 1).map((action, i) => (
                <ActionButton key={i} action={action} />
              ))}
              {actions.length > 1 && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    {actions.slice(1).map((action, i) => (
                      <DropdownMenuItem key={i} onClick={action.onClick} disabled={action.disabled} className="cursor-pointer">
                        {action.icon && <span className="mr-2">{action.icon}</span>}
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ActionButton({ action }: { action: PageAction }) {
  if (action.href) {
    return (
      <Link href={action.href}>
        <Button variant={action.variant ?? 'default'} size="sm" className="cursor-pointer">
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      </Link>
    )
  }
  return (
    <Button
      variant={action.variant ?? 'default'}
      size="sm"
      onClick={action.onClick}
      disabled={action.disabled || action.loading}
      className="cursor-pointer"
    >
      {action.icon && <span className="mr-2">{action.icon}</span>}
      {action.label}
    </Button>
  )
}
