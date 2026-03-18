import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/components/base/app-badge"

export interface AppAvatarProps {
  name?: string
  src?: string
  role?: UserRole
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  showRing?: boolean
  className?: string
}

const sizeStyles = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
}

const ringColors: Record<UserRole, string> = {
  student:   "ring-sky-400",
  teacher:   "ring-emerald-400",
  principal: "ring-teal-400",
  admin:     "ring-purple-400",
  librarian: "ring-violet-400",
  staff:     "ring-slate-400",
}

function getInitialsColor(name: string): string {
  const colors = [
    "bg-teal-500", "bg-emerald-500", "bg-blue-500", "bg-purple-500",
    "bg-amber-500", "bg-rose-500", "bg-sky-500", "bg-indigo-500",
  ]
  if (!name) return colors[0]!
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]!
}

function getInitials(name: string): string {
  if (!name) return '?'
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function AppAvatar({ name = '', src, role, size = "md", showRing, className }: AppAvatarProps) {
  return (
    <Avatar
      className={cn(
        sizeStyles[size],
        showRing && role && `ring-2 ring-offset-1 ${ringColors[role]}`,
        className
      )}
    >
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className={cn("text-white font-medium", getInitialsColor(name))}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
