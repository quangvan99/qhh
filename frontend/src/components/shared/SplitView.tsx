'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SplitViewProps {
  left: React.ReactNode
  right: React.ReactNode
  defaultLeftWidth?: number // percentage
  minLeftWidth?: number
  maxLeftWidth?: number
  leftClassName?: string
  rightClassName?: string
  onSplitChange?: (leftPercent: number) => void
  /** On mobile (< 768px), which panel to show by default */
  mobileLayout?: 'left' | 'right' | 'tabs'
  storageKey?: string
  className?: string
}

export function SplitView({
  left,
  right,
  defaultLeftWidth = 40,
  minLeftWidth = 20,
  maxLeftWidth = 70,
  leftClassName,
  rightClassName,
  onSplitChange,
  mobileLayout = 'right',
  storageKey,
  className,
}: SplitViewProps) {
  const [leftWidth, setLeftWidth] = useState(() => {
    if (storageKey && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`split-view:${storageKey}`)
      if (stored) return parseFloat(stored)
    }
    return defaultLeftWidth
  })
  const [mobileTab, setMobileTab] = useState<'left' | 'right'>(
    mobileLayout === 'left' ? 'left' : 'right'
  )
  const [isMobile, setIsMobile] = useState(false)
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const updateWidth = useCallback(
    (pct: number) => {
      const clamped = Math.max(minLeftWidth, Math.min(maxLeftWidth, pct))
      setLeftWidth(clamped)
      onSplitChange?.(clamped)
      if (storageKey) localStorage.setItem(`split-view:${storageKey}`, String(clamped))
    },
    [minLeftWidth, maxLeftWidth, onSplitChange, storageKey]
  )

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      updateWidth(pct)
    },
    [updateWidth]
  )

  const stopDrag = useCallback(() => {
    isDragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const onDoubleClick = useCallback(() => {
    updateWidth(defaultLeftWidth)
  }, [defaultLeftWidth, updateWidth])

  if (isMobile && mobileLayout === 'tabs') {
    return (
      <div className={cn('flex flex-col h-full', className)}>
        {/* Tab switcher */}
        <div className="flex border-b shrink-0">
          <button
            onClick={() => setMobileTab('left')}
            className={cn(
              'flex-1 py-2 text-sm font-medium transition-colors',
              mobileTab === 'left'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Danh sách
          </button>
          <button
            onClick={() => setMobileTab('right')}
            className={cn(
              'flex-1 py-2 text-sm font-medium transition-colors',
              mobileTab === 'right'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Chi tiết
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {mobileTab === 'left' ? (
            <div className={leftClassName}>{left}</div>
          ) : (
            <div className={rightClassName}>{right}</div>
          )}
        </div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className={cn('flex flex-col h-full overflow-auto', className)}>
        <div className={leftClassName}>{left}</div>
        <div className={rightClassName}>{right}</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('flex h-full overflow-hidden select-none', className)}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {/* Left panel */}
      <div
        className={cn('overflow-auto shrink-0', leftClassName)}
        style={{ width: `${leftWidth}%` }}
      >
        {left}
      </div>

      {/* Resize handle */}
      <div
        className="flex w-2 shrink-0 cursor-col-resize items-center justify-center group hover:bg-primary/10 active:bg-primary/20 transition-colors"
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        title="Kéo để thay đổi kích thước. Double-click để reset."
      >
        <div className="h-8 w-0.5 rounded-full bg-border group-hover:bg-primary/50 transition-colors" />
      </div>

      {/* Right panel */}
      <div className={cn('flex-1 overflow-auto min-w-0', rightClassName)}>
        {right}
      </div>
    </div>
  )
}
