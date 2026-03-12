"use client"

import { forwardRef, useRef, useEffect, useId } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { TextareaHTMLAttributes } from "react"

export interface AppTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
  required?: boolean
  maxLength?: number
  showCount?: boolean
  minRows?: number
  autoResize?: boolean
}

export const AppTextarea = forwardRef<HTMLTextAreaElement, AppTextareaProps>(
  ({ label, error, helper, required, maxLength, showCount, minRows = 3, autoResize,
     className, id, value, onChange, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef

    const generatedId = useId()
    const inputId = id || generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const describedBy = error ? errorId : helper ? helperId : undefined
    const currentLength = typeof value === "string" ? value.length : 0

    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const el = textareaRef.current
        el.style.height = "auto"
        el.style.height = `${el.scrollHeight}px`
      }
    }, [value, autoResize, textareaRef])

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
            {required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
          </Label>
        )}
        <Textarea
          ref={textareaRef}
          id={inputId}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          maxLength={maxLength}
          rows={minRows}
          value={value}
          onChange={onChange}
          className={cn(
            "resize-none transition-colors duration-150",
            autoResize && "overflow-hidden",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        <div className="flex items-center justify-between">
          <div>
            {error && <p id={errorId} role="alert" className="text-sm text-destructive">{error}</p>}
            {!error && helper && <p id={helperId} className="text-sm text-muted-foreground">{helper}</p>}
          </div>
          {showCount && maxLength && (
            <span className={cn("text-xs text-muted-foreground", currentLength >= maxLength && "text-destructive")}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)
AppTextarea.displayName = "AppTextarea"
