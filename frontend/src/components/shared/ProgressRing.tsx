'use client'

import { useEffect, useRef } from 'react'

interface ProgressRingProps {
  value: number         // 0–100
  max?: number
  size?: number         // px
  strokeWidth?: number  // px
  color?: string        // CSS color
  trackColor?: string
  showValue?: boolean
  label?: string
  sublabel?: string
  animate?: boolean
  className?: string
}

export function ProgressRing({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  color = 'hsl(var(--primary))',
  trackColor,
  showValue = true,
  label,
  sublabel,
  animate = true,
  className,
}: ProgressRingProps) {
  const circleRef = useRef<SVGCircleElement>(null)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(value / max, 0), 1)
  const offset = circumference * (1 - progress)

  // Animate on mount
  useEffect(() => {
    if (!animate || !circleRef.current) return
    circleRef.current.style.strokeDashoffset = String(circumference)
    const raf = requestAnimationFrame(() => {
      if (circleRef.current) {
        circleRef.current.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        circleRef.current.style.strokeDashoffset = String(offset)
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [offset, circumference, animate])

  const displayPct = Math.round(progress * 100)

  return (
    <div className={className} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
          aria-valuenow={displayPct}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor ?? 'currentColor'}
            strokeWidth={strokeWidth}
            className={trackColor ? '' : 'text-muted/30'}
            opacity={trackColor ? 1 : 0.3}
          />
          {/* Progress */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={animate ? circumference : offset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center label */}
        {showValue && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: size * 0.2, fontWeight: 700, lineHeight: 1 }}>
              {displayPct}%
            </span>
          </div>
        )}
      </div>

      {label && (
        <span style={{ fontSize: 12, fontWeight: 500, textAlign: 'center', maxWidth: size }}>
          {label}
        </span>
      )}
      {sublabel && (
        <span style={{ fontSize: 10, color: 'hsl(var(--muted-foreground))', textAlign: 'center' }}>
          {sublabel}
        </span>
      )}
    </div>
  )
}
