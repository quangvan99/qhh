"use client"

import Link from "next/link"
import { Users, MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppAvatar } from "@/components/base/app-avatar"
import { AppBadge } from "@/components/base/app-badge"
import { cn } from "@/lib/utils"
import type { LMSClass } from "../types/class.types"

interface ClassCardProps {
  cls: LMSClass
  onEdit?: () => void
  onCopy?: () => void
  onDelete?: () => void
  className?: string
}

const statusLabels: Record<LMSClass["status"], string> = {
  active: "Đang học",
  completed: "Kết thúc",
  upcoming: "Sắp khai giảng",
}

const statusVariants: Record<LMSClass["status"], "success" | "neutral" | "info"> = {
  active: "success",
  completed: "neutral",
  upcoming: "info",
}

export function ClassCard({ cls, onEdit, onCopy, onDelete, className }: ClassCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow duration-150", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link href={`/lms/classes/${cls.id}/content`} className="text-base font-semibold text-foreground hover:text-emerald-600 transition-colors cursor-pointer line-clamp-1">
              {cls.name}
            </Link>
            <p className="text-sm text-muted-foreground mt-0.5">{cls.code}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="cursor-pointer h-8 w-8 p-0" />}>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && <DropdownMenuItem onClick={onEdit} className="cursor-pointer"><Pencil className="mr-2 h-3.5 w-3.5" />Sửa</DropdownMenuItem>}
              {onCopy && <DropdownMenuItem onClick={onCopy} className="cursor-pointer"><Copy className="mr-2 h-3.5 w-3.5" />Sao chép</DropdownMenuItem>}
              {onDelete && <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive"><Trash2 className="mr-2 h-3.5 w-3.5" />Xóa</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <AppAvatar name={cls.teacher.name} src={cls.teacher.avatar} size="xs" />
          <span className="text-sm text-muted-foreground truncate">{cls.teacher.name}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{cls.studentCount}</span>
          </div>
          <AppBadge semantic={statusVariants[cls.status]} size="sm">{statusLabels[cls.status]}</AppBadge>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Tiến độ</span>
            <span>{cls.progress}%</span>
          </div>
          <Progress value={cls.progress} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  )
}
