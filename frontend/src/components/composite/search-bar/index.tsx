'use client'
import { useEffect, useState } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  debounceMs?: number
  placeholder?: string
  className?: string
  disabled?: boolean
  loading?: boolean
}

export function SearchBar({ value, onChange, onClear, debounceMs = 300, placeholder = 'Tìm kiếm...', className, disabled, loading }: SearchBarProps) {
  const [internal, setInternal] = useState(value)

  useEffect(() => { setInternal(value) }, [value])

  useEffect(() => {
    const timer = setTimeout(() => { if (internal !== value) onChange(internal) }, debounceMs)
    return () => clearTimeout(timer)
  }, [internal, debounceMs]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClear = () => {
    setInternal('')
    onChange('')
    onClear?.()
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-9 pr-9 min-h-[44px]"
        aria-label={placeholder}
      />
      {loading ? (
        <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />
      ) : internal ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 h-7 w-7 p-0 cursor-pointer"
          aria-label="Xóa tìm kiếm"
        >
          <X className="h-3 w-3" />
        </Button>
      ) : null}
    </div>
  )
}
