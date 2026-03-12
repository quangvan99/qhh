'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { AppBadge } from '@/components/base'
import { AppAvatar } from '@/components/base'
import type { StudentClass } from '../types/student.types'

interface ClassCardProps {
  cls: StudentClass
}

const statusMap = {
  active: { label: 'Đang học', semantic: 'success' as const },
  completed: { label: 'Đã hoàn thành', semantic: 'neutral' as const },
  archived: { label: 'Lưu trữ', semantic: 'neutral' as const },
}

export function ClassCard({ cls }: ClassCardProps) {
  const st = statusMap[cls.status]

  return (
    <Card className="flex flex-col">
      {cls.thumbnail && (
        <div className="relative h-36 overflow-hidden rounded-t-xl">
          <img src={cls.thumbnail} alt={cls.name} className="h-full w-full object-cover" />
        </div>
      )}
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/my-classes/${cls.id}`} className="text-base font-semibold hover:text-emerald-600 line-clamp-2 transition-colors">
            {cls.name}
          </Link>
          <AppBadge semantic={st.semantic} size="sm">{st.label}</AppBadge>
        </div>

        <AppBadge semantic="info" size="sm">{cls.subject}</AppBadge>

        <div className="flex items-center gap-2">
          <AppAvatar name={cls.teacher} src={cls.teacherAvatar} size="xs" />
          <span className="text-sm text-muted-foreground">{cls.teacher}</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{cls.completedContent}/{cls.totalContent} nội dung</span>
            <span>{cls.progressPercent}%</span>
          </div>
          <Progress value={cls.progressPercent} />
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/my-classes/${cls.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full cursor-pointer">
            <BookOpen className="mr-2 h-4 w-4" />
            Vào lớp
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export function ClassCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3">
        <Skeleton className="h-36 w-full rounded-lg" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-2 w-full" />
      </CardContent>
    </Card>
  )
}
