"use client"

import { forwardRef, useId } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { InputHTMLAttributes } from "react"

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  required?: boolean
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  ({ label, error, helper, required, leftAddon, rightAddon, className, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const describedBy = error ? errorId : helper ? helperId : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
          </Label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3 flex items-center text-muted-foreground">
              {leftAddon}
            </div>
          )}
          <Input
            ref={ref}
            id={inputId}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              "min-h-[44px] transition-colors duration-150",
              leftAddon && "pl-10",
              rightAddon && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3 flex items-center text-muted-foreground">
              {rightAddon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {!error && helper && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helper}
          </p>
        )}
      </div>
    )
  }
)
AppInput.displayName = "AppInput"
