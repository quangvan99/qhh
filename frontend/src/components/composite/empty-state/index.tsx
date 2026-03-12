import { Inbox } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: { label: string; onClick?: () => void; href?: string }
  secondaryAction?: { label: string; onClick?: () => void }
  className?: string
}

export function EmptyState({ title, description, icon, action, secondaryAction, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 text-muted-foreground">
        {icon ?? <Inbox className="h-12 w-12" strokeWidth={1.5} />}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>}
      {(action || secondaryAction) && (
        <div className="mt-6 flex items-center gap-3">
          {action && (
            action.href ? (
              <Link href={action.href}>
                <Button className="cursor-pointer">{action.label}</Button>
              </Link>
            ) : (
              <Button onClick={action.onClick} className="cursor-pointer">{action.label}</Button>
            )
          )}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick} className="cursor-pointer">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
