'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { AppBadge } from '@/components/base'
import { AppAvatar } from '@/components/base'
import { useGetMyClass, useGetMyContentGroups } from '@/features/lms/student/api/student.api'
import { ContentSidebar } from '@/features/lms/student/components/ContentSidebar'
import { ContentViewer, ContentViewerSkeleton } from '@/features/lms/student/components/ContentViewer'
import type { StudentContentItem } from '@/features/lms/student/types/student.types'

export default function MyClassDetailPage() {
  const params = useParams<{ classId: string }>()
  const classId = params.classId
  const { data: cls, isLoading: classLoading } = useGetMyClass(classId)
  const { data: groups, isLoading: contentLoading } = useGetMyContentGroups(classId)

  const [activeTab, setActiveTab] = useState('content')
  const [activeItemId, setActiveItemId] = useState<string | undefined>()

  // Find active item
  const { activeItem, activeGroupId } = useMemo(() => {
    if (!groups) return { activeItem: undefined, activeGroupId: undefined }

    for (const group of groups) {
      const found = group.items.find((it: StudentContentItem) => it.id === activeItemId)
      if (found) {
        return { activeItem: found, activeGroupId: group.id }
      }
    }
    // Default to first unlocked item
    for (const group of groups) {
      const first = group.items.find((it: StudentContentItem) => !it.locked)
      if (first) {
        return { activeItem: first, activeGroupId: group.id }
      }
    }
    return { activeItem: undefined, activeGroupId: undefined }
  }, [groups, activeItemId])

  // Sync default active item to state
  useEffect(() => {
    if (activeItem && !activeItemId) {
      setActiveItemId(activeItem.id)
    }
  }, [activeItem, activeItemId])

  const handleNavigate = useCallback((groupId: string, itemId: string) => {
    setActiveItemId(itemId)
  }, [])

  if (classLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (!cls) return null

  return (
    <div>
      <PageHeader
        title={cls.name}
        subtitle={cls.subject}
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls.name },
        ]}
      />

      <div className="mb-4 flex items-center gap-3">
        <AppAvatar name={cls.teacher} src={cls.teacherAvatar} size="sm" role="teacher" />
        <span className="text-sm text-muted-foreground">{cls.teacher}</span>
        <AppBadge semantic="info" size="sm">{cls.subject}</AppBadge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="assignments">Bài tập</TabsTrigger>
          <TabsTrigger value="discussions">Thảo luận</TabsTrigger>
          <TabsTrigger value="results">Kết quả</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          {contentLoading ? (
            <div className="flex gap-6">
              <div className="w-1/4 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
              <div className="flex-1">
                <ContentViewerSkeleton />
              </div>
            </div>
          ) : groups ? (
            <div className="flex gap-6">
              <aside className="w-1/4 shrink-0">
                <ContentSidebar
                  classId={classId}
                  groups={groups}
                  activeItemId={activeItemId}
                />
              </aside>
              <main className="flex-1">
                {activeItem ? (
                  <ContentViewer
                    classId={classId}
                    item={activeItem}
                    groups={groups}
                    onNavigate={handleNavigate}
                  />
                ) : (
                  <p className="text-muted-foreground">Chọn nội dung để bắt đầu học</p>
                )}
              </main>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          <p className="text-sm text-muted-foreground">
            <a href={`/my-classes/${classId}/assignments`} className="text-emerald-600 hover:underline">
              Xem danh sách bài tập →
            </a>
          </p>
        </TabsContent>

        <TabsContent value="discussions" className="mt-4">
          <p className="text-sm text-muted-foreground">
            <a href={`/my-classes/${classId}/discussions`} className="text-emerald-600 hover:underline">
              Xem thảo luận →
            </a>
          </p>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <p className="text-sm text-muted-foreground">
            <a href={`/my-classes/${classId}/results`} className="text-emerald-600 hover:underline">
              Xem kết quả →
            </a>
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
