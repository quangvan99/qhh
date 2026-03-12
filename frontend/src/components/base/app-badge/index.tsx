import { cn } from "@/lib/utils"

export type UserRole = "student" | "teacher" | "principal" | "admin" | "librarian" | "staff"
export type SemanticVariant = "success" | "warning" | "error" | "info" | "neutral"

export interface AppBadgeProps {
  role?: UserRole
  semantic?: SemanticVariant
  size?: "sm" | "md" | "lg"
  dot?: boolean
  children: React.ReactNode
  className?: string
}

const roleStyles: Record<UserRole, string> = {
  student:   "bg-sky-100 text-sky-800",
  teacher:   "bg-emerald-100 text-emerald-800",
  principal: "bg-teal-100 text-teal-800",
  admin:     "bg-purple-100 text-purple-800",
  librarian: "bg-violet-100 text-violet-800",
  staff:     "bg-slate-100 text-slate-800",
}

const semanticStyles: Record<SemanticVariant, string> = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error:   "bg-red-100 text-red-800",
  info:    "bg-blue-100 text-blue-800",
  neutral: "bg-gray-100 text-gray-700",
}

const dotColors: Record<SemanticVariant, string> = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error:   "bg-red-500",
  info:    "bg-blue-500",
  neutral: "bg-gray-400",
}

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
  lg: "text-sm px-3 py-1.5",
}

export function AppBadge({ role, semantic, size = "md", dot, children, className }: AppBadgeProps) {
  const colorClass = role
    ? roleStyles[role]
    : semantic
    ? semanticStyles[semantic]
    : semanticStyles.neutral

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        sizeStyles[size],
        colorClass,
        className
      )}
    >
      {dot && semantic && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[semantic])} aria-hidden="true" />
      )}
      {children}
    </span>
  )
}
