'use client'

import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  LogIn, FileText, Camera, BookOpen, Award, Bell,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecentActivity } from '../api/dashboard.api'
import type { ActivityItem } from '../types/dashboard.types'

const activityIcons: Record<ActivityItem['type'], React.ReactNode> = {
  login: <LogIn className="h-4 w-4 text-blue-500" />,
  submission: <FileText className="h-4 w-4 text-emerald-500" />,
  attendance: <Camera className="h-4 w-4 text-teal-500" />,
  borrow: <BookOpen className="h-4 w-4 text-purple-500" />,
  grade: <Award className="h-4 w-4 text-amber-500" />,
  announcement: <Bell className="h-4 w-4 text-slate-500" />,
}

export function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivity()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
                  {activityIcons[activity.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {activity.user && (
                      <span className="text-xs text-muted-foreground font-medium">
                        {activity.user.name}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
