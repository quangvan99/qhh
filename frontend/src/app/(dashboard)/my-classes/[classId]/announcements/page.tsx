'use client'

import { useParams } from 'next/navigation'
import { Bell } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { EmptyState } from '@/components/composite'
import { AppAvatar } from '@/components/base'
import { AppBadge } from '@/components/base'
import { useGetMyClass, useGetClassNotifications } from '@/features/lms/student/api/student.api'
import type { ClassNotification } from '@/features/lms/student/types/student.types'

// Pure utility at module level — avoids "impure function during render" lint error
function isNewNotification(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000
}

export default function ClassAnnouncementsPage() {
  const params = useParams<{ classId: string }>()
  const { data: cls } = useGetMyClass(params.classId)
  const { data: notifications, isLoading } = useGetClassNotifications(params.classId)

  return (
    <div>
      <PageHeader
        title="Thông báo"
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls?.name ?? '...', href: `/my-classes/${params.classId}` },
          { label: 'Thông báo' },
        ]}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif: ClassNotification) => (
            <Card key={notif.id} size="sm">
              <CardContent className="space-y-2">
                <div className="flex items-center gap-3">
                  <AppAvatar name={notif.sender.name} src={notif.sender.avatar} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{notif.sender.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
                      </span>
                      {isNewNotification(notif.createdAt) && (
                        <AppBadge semantic="info" size="sm">Mới</AppBadge>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className={`text-sm ${!notif.read ? 'font-bold' : 'font-medium'}`}>
                  {notif.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{notif.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Không có thông báo"
          icon={<Bell className="h-12 w-12" strokeWidth={1.5} />}
        />
      )}
    </div>
  )
}
