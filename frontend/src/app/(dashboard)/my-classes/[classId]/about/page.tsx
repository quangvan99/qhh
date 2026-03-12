'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/composite'
import { AppAvatar } from '@/components/base'
import { useGetMyClass } from '@/features/lms/student/api/student.api'

export default function ClassAboutPage() {
  const params = useParams<{ classId: string }>()
  const { data: cls, isLoading } = useGetMyClass(params.classId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!cls) return null

  return (
    <div>
      <PageHeader
        title="Giới thiệu lớp học"
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls.name, href: `/my-classes/${cls.id}` },
          { label: 'Giới thiệu' },
        ]}
      />

      {cls.thumbnail && (
        <div className="relative mb-6 h-48 overflow-hidden rounded-xl">
          <img src={cls.thumbnail} alt={cls.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6">
            <h2 className="text-2xl font-bold text-white">{cls.name}</h2>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Thông tin lớp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <AppAvatar name={cls.teacher} src={cls.teacherAvatar} size="md" role="teacher" showRing />
            <div>
              <p className="font-medium">{cls.teacher}</p>
              <p className="text-sm text-muted-foreground">Giáo viên</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {cls.semester && (
              <div>
                <p className="text-muted-foreground">Học kỳ</p>
                <p className="font-medium">{cls.semester}</p>
              </div>
            )}
            {cls.year && (
              <div>
                <p className="text-muted-foreground">Năm học</p>
                <p className="font-medium">{cls.year}</p>
              </div>
            )}
            {cls.startDate && (
              <div>
                <p className="text-muted-foreground">Ngày khai giảng</p>
                <p className="font-medium">{new Date(cls.startDate).toLocaleDateString('vi-VN')}</p>
              </div>
            )}
            {cls.endDate && (
              <div>
                <p className="text-muted-foreground">Ngày kết thúc</p>
                <p className="font-medium">{new Date(cls.endDate).toLocaleDateString('vi-VN')}</p>
              </div>
            )}
            {cls.studentCount !== undefined && (
              <div>
                <p className="text-muted-foreground">Số học sinh</p>
                <p className="font-medium">{cls.studentCount}</p>
              </div>
            )}
          </div>

          {cls.description && (
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Mô tả</p>
              <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: cls.description }} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
