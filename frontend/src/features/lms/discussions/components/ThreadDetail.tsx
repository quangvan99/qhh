'use client'

import { useState } from 'react'
import { Pencil, Trash2, Lock, Unlock } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import type { DiscussionPost } from '../types'

const mockPosts: DiscussionPost[] = Array.from({ length: 8 }, (_, i) => ({
  id: `p-${i}`, threadId: 't-1', authorId: `u-${i}`,
  authorName: i === 0 ? 'GV. Nguyễn Thị B' : `HS. Trần Văn ${String.fromCharCode(65 + i)}`,
  authorRole: i === 0 ? 'teacher' : 'student' as const,
  content: i === 0 ? 'Bài đăng gốc: Các em hãy thảo luận về chủ đề này...' : `Phản hồi ${i}: Ý kiến của em về vấn đề này là...`,
  createdAt: `2026-03-10T${8 + i}:00:00Z`,
}))

export function ThreadDetail({ classId, threadId }: { classId: string; threadId: string }) {
  const [reply, setReply] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const original = mockPosts[0]!
  const replies = mockPosts.slice(1)

  return (
    <div>
      <PageHeader
        title="Thảo luận: Chủ đề bài học"
        breadcrumbs={[{ label: 'Lớp học', href: '/lms/classes' }, { label: 'Thảo luận', href: `/lms/classes/${classId}/discussions` }, { label: 'Chi tiết' }]}
        actions={[
          { label: 'Sửa', variant: 'outline', icon: <Pencil className="h-4 w-4" /> },
          { label: 'Xóa', variant: 'destructive', icon: <Trash2 className="h-4 w-4" />, onClick: () => setDeleteOpen(true) },
          { label: 'Đóng thảo luận', variant: 'outline', icon: <Lock className="h-4 w-4" /> },
        ]}
      />

      {/* Original post */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AppAvatar name={original.authorName} size="md" role="teacher" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{original.authorName}</span>
                <AppBadge role="teacher" size="sm">GV</AppBadge>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(original.createdAt).toLocaleString('vi-VN')}</span>
            </div>
          </div>
          <div className="prose prose-sm max-w-none">{original.content}</div>
        </CardContent>
      </Card>

      <Separator className="my-4" />
      <p className="text-sm font-medium mb-4">{replies.length} phản hồi</p>

      {/* Replies */}
      <div className="space-y-3 mb-6">
        {replies.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AppAvatar name={post.authorName} size="sm" role={post.authorRole === 'teacher' ? 'teacher' : 'student'} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{post.authorName}</span>
                    <AppBadge role={post.authorRole === 'teacher' ? 'teacher' : 'student'} size="sm">
                      {post.authorRole === 'teacher' ? 'GV' : 'HS'}
                    </AppBadge>
                    <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <p className="text-sm">{post.content}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive shrink-0"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply form */}
      <Card>
        <CardContent className="p-4">
          <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4} placeholder="Nhập phản hồi..." className="mb-3" />
          <Button className="cursor-pointer" disabled={!reply.trim()}>Gửi phản hồi</Button>
        </CardContent>
      </Card>

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => setDeleteOpen(false)} title="Xóa thảo luận" description="Xóa thảo luận này và tất cả phản hồi?" variant="danger" />
    </div>
  )
}
