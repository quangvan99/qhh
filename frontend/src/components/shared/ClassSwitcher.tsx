'use client'

import { useState } from 'react'
import { Check, ChevronDown, BookOpen, AlertCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ClassOption {
  id: string
  name: string
  subject: string
  studentCount: number
  hasAlert?: boolean
}

interface ClassSwitcherProps {
  classes: ClassOption[]
  currentClassId: string | null
  onChange: (id: string) => void
  isLoading?: boolean
  className?: string
}

export function ClassSwitcher({
  classes,
  currentClassId,
  onChange,
  isLoading = false,
  className,
}: ClassSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const current = classes.find(c => c.id === currentClassId)
  const showSearch = classes.length >= 5
  const filtered = search
    ? classes.filter(
        c =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.subject.toLowerCase().includes(search.toLowerCase())
      )
    : classes

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch('') }}>
      <PopoverTrigger
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'inline-flex items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-8 min-w-[140px]',
          className
        )}
        disabled={isLoading}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {isLoading ? (
            <span className="text-muted-foreground">Đang tải...</span>
          ) : current ? (
            <span className="font-medium truncate">{current.name}</span>
          ) : (
            <span className="text-muted-foreground">Chọn lớp</span>
          )}
          {current?.hasAlert && (
            <AlertCircle className="h-3 w-3 text-orange-500 shrink-0" />
          )}
        </span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform', open && 'rotate-180')} />
      </PopoverTrigger>

      <PopoverContent className="w-60 p-1" align="start" role="listbox">
        {showSearch && (
          <div className="px-2 py-1.5">
            <Input
              placeholder="Tìm lớp..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-7 text-xs"
              autoFocus
            />
          </div>
        )}

        <div className="max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">Không tìm thấy lớp</p>
          ) : (
            filtered.map(cls => (
              <button
                key={cls.id}
                role="option"
                aria-selected={cls.id === currentClassId}
                onClick={() => { onChange(cls.id); setOpen(false); setSearch('') }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors',
                  cls.id === currentClassId && 'bg-muted'
                )}
              >
                <Check
                  className={cn('h-3.5 w-3.5 text-primary shrink-0', cls.id !== currentClassId && 'invisible')}
                />
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium flex items-center gap-1">
                    {cls.name}
                    {cls.hasAlert && (
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {cls.subject} · {cls.studentCount} HS
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
