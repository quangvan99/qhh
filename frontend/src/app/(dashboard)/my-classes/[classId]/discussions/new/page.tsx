'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/composite'
import { useGetMyClass, useCreateDiscussion } from '@/features/lms/student/api/student.api'
import { toast } from 'sonner'

export default function NewDiscussionPage() {
  const params = useParams<{ classId: string }>()
  const router = useRouter()
  const { data: cls } = useGetMyClass(params.classId)
  const createMutation = useCreateDiscussion()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung')
      return
    }
    try {
      await createMutation.mutateAsync({ classId: params.classId, title, content })
      toast.success('Đã tạo thảo luận')
      router.push(`/my-classes/${params.classId}/discussions`)
    } catch {
      toast.error('Tạo thảo luận thất bại')
    }
  }

  return (
    <div>
      <PageHeader
        title="Tạo thảo luận mới"
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls?.name ?? '...', href: `/my-classes/${params.classId}` },
          { label: 'Thảo luận', href: `/my-classes/${params.classId}/discussions` },
          { label: 'Tạo mới' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Tạo thảo luận mới</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Tiêu đề *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề thảo luận..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Nội dung *</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung..."
              rows={6}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="cursor-pointer"
            >
              {createMutation.isPending ? 'Đang đăng...' : 'Đăng'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
