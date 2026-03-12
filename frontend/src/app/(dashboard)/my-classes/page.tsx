'use client'

import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { EmptyState } from '@/components/composite'
import { AppBadge } from '@/components/base'
import { AppAvatar } from '@/components/base'
import { ConfirmDialog } from '@/components/composite'
import { toast } from 'sonner'
import { ClassCard, ClassCardSkeleton } from '@/features/lms/student/components/ClassCard'
import { useGetMyClasses, useSearchPublicClasses, useEnrollClass } from '@/features/lms/student/api/student.api'
import type { PublicClass, StudentClass } from '@/features/lms/student/types/student.types'

export default function MyClassesPage() {
  const [tab, setTab] = useState('active')
  const { data: classes, isLoading } = useGetMyClasses(
    tab === 'all' ? undefined : { status: tab }
  )

  const [showEnroll, setShowEnroll] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const { data: publicClasses, isLoading: searching } = useSearchPublicClasses(searchQ)
  const enrollMutation = useEnrollClass()
  const [enrollTarget, setEnrollTarget] = useState<PublicClass | null>(null)
  const [showEnrollConfirm, setShowEnrollConfirm] = useState(false)

  const activeCount = classes?.filter((c: StudentClass) => c.status === 'active').length ?? 0
  const completedCount = classes?.filter((c: StudentClass) => c.status === 'completed').length ?? 0

  const handleEnroll = async () => {
    if (!enrollTarget) return
    try {
      const res = await enrollMutation.mutateAsync(enrollTarget.id)
      toast.success(res.message ?? 'Đăng ký thành công')
      setShowEnrollConfirm(false)
      setShowEnroll(false)
    } catch {
      toast.error('Đăng ký thất bại')
    }
  }

  return (
    <div>
      <PageHeader
        title="Lớp học của tôi"
        actions={[
          {
            label: 'Tìm & Đăng ký lớp mới',
            icon: <Search className="h-4 w-4" />,
            onClick: () => setShowEnroll(true),
          },
        ]}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="active">Đang học ({activeCount})</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành ({completedCount})</TabsTrigger>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ClassCardSkeleton key={i} />
              ))}
            </div>
          ) : classes && classes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls: StudentClass) => (
                <ClassCard key={cls.id} cls={cls} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không có lớp học nào"
              description="Hãy tìm và đăng ký lớp học mới"
              action={{
                label: 'Tìm lớp học',
                onClick: () => setShowEnroll(true),
              }}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Enroll dialog */}
      <Dialog open={showEnroll} onOpenChange={setShowEnroll}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Đăng ký lớp học mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tìm theo tên lớp..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
              <Button variant="outline" size="sm" className="cursor-pointer shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {searching && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            )}

            {publicClasses?.data && publicClasses.data.length > 0 ? (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {publicClasses.data.map((cls: PublicClass) => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{cls.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AppAvatar name={cls.teacher} src={cls.teacherAvatar} size="xs" />
                        <span>{cls.teacher}</span>
                        <span>• {cls.studentCount} HS</span>
                      </div>
                      <AppBadge
                        semantic={cls.status === 'open' ? 'success' : cls.status === 'full' ? 'error' : 'warning'}
                        size="sm"
                      >
                        {cls.status === 'open' ? 'Còn chỗ' : cls.status === 'full' ? 'Hết chỗ' : 'Chờ duyệt'}
                      </AppBadge>
                    </div>
                    <Button
                      size="sm"
                      disabled={cls.status === 'full'}
                      onClick={() => {
                        setEnrollTarget(cls)
                        setShowEnrollConfirm(true)
                      }}
                      className="cursor-pointer"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Đăng ký
                    </Button>
                  </div>
                ))}
              </div>
            ) : searchQ && !searching ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Không tìm thấy lớp học nào</p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showEnrollConfirm}
        onOpenChange={setShowEnrollConfirm}
        title="Xác nhận đăng ký"
        description={`Bạn muốn đăng ký lớp "${enrollTarget?.name ?? ''}"?`}
        onConfirm={handleEnroll}
        confirmLabel="Đăng ký"
        loading={enrollMutation.isPending}
      />
    </div>
  )
}
