'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Pin, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { EmptyState } from '@/components/composite'
import { AppAvatar, AppBadge } from '@/components/base'
import { useGetMyClass, useGetDiscussions } from '@/features/lms/student/api/student.api'
import type { DiscussionThread } from '@/features/lms/student/types/student.types'

export default function ClassDiscussionsPage() {
  const params = useParams<{ classId: string }>()
  const { data: cls } = useGetMyClass(params.classId)
  const [sort, setSort] = useState('newest')
  const { data: threads, isLoading } = useGetDiscussions(params.classId, sort)

  return (
    <div>
      <PageHeader
        title={`Thảo luận — ${cls?.name ?? '...'}`}
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls?.name ?? '...', href: `/my-classes/${params.classId}` },
          { label: 'Thảo luận' },
        ]}
        actions={[
          {
            label: 'Tạo thảo luận mới',
            icon: <Plus className="h-4 w-4" />,
            href: `/my-classes/${params.classId}/discussions/new`,
          },
        ]}
      />

      <div className="mb-4 flex gap-2">
        {['newest', 'most_replies', 'unread'].map((s) => (
          <Button
            key={s}
            variant={sort === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSort(s)}
            className="cursor-pointer"
          >
            {s === 'newest' ? 'Mới nhất' : s === 'most_replies' ? 'Nhiều reply' : 'Chưa đọc'}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : threads && threads.length > 0 ? (
        <div className="space-y-3">
          {threads.map((thread: DiscussionThread) => (
            <Link key={thread.id} href={`/my-classes/${params.classId}/discussions/${thread.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AppAvatar name={thread.author.name} src={thread.author.avatar} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{thread.author.name}</span>
                        <AppBadge
                          role={thread.author.role === 'teacher' ? 'teacher' : 'student'}
                          size="sm"
                        >
                          {thread.author.role === 'teacher' ? 'GV' : 'HS'}
                        </AppBadge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(thread.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    {thread.pinned && <Pin className="h-4 w-4 text-amber-500" />}
                  </div>

                  <h3 className={`text-sm ${thread.unread ? 'font-bold' : 'font-medium'}`}>
                    {thread.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{thread.content}</p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {thread.replyCount} replies
                    </span>
                    {thread.unread && <AppBadge semantic="info" size="sm">Mới</AppBadge>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Chưa có thảo luận nào"
          action={{
            label: 'Tạo thảo luận mới',
            href: `/my-classes/${params.classId}/discussions/new`,
          }}
        />
      )}
    </div>
  )
}
