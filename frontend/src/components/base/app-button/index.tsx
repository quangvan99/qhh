"use client"

import { forwardRef, type ComponentProps } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ModuleColor = "lms" | "exam" | "ai" | "library" | "admin"

export interface AppButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean
  module?: ModuleColor
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const moduleStyles: Record<ModuleColor, string> = {
  lms:     "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 focus-visible:ring-emerald-500",
  exam:    "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 focus-visible:ring-amber-500",
  ai:      "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 focus-visible:ring-blue-500",
  library: "bg-purple-600 hover:bg-purple-700 text-white border-purple-600 focus-visible:ring-purple-500",
  admin:   "bg-slate-600 hover:bg-slate-700 text-white border-slate-600 focus-visible:ring-slate-500",
}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ loading, module: mod, leftIcon, rightIcon, children, className, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "min-h-[44px] min-w-[44px] cursor-pointer transition-colors duration-150",
          mod && moduleStyles[mod],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="mr-2 flex items-center">{leftIcon}</span>
        ) : null}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2 flex items-center">{rightIcon}</span>
        )}
      </Button>
    )
  }
)
AppButton.displayName = "AppButton"
