'use client'

import { useState } from 'react'
import { Plus, Pin, Trash2, Pencil, MessageSquare, Eye } from 'lucide-react'
import { PageHeader } from '@/components/composite/page-header'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { AppAvatar } from '@/components/base/app-avatar'
import { AppBadge } from '@/components/base/app-badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import type { DiscussionThread } from '../types'

const mockThreads: DiscussionThread[] = Array.from({ length: 10 }, (_, i) => ({
  id: `t-${i}`, classId: '1', title: `Thảo luận ${i + 1}: Chủ đề bài học`,
  body: 'Nội dung thảo luận chi tiết về bài học hôm nay, các em hãy tham gia thảo luận tích cực nhé...',
  authorId: `u-${i}`, authorName: i % 3 === 0 ? 'GV. Nguyễn Thị B' : `HS. Trần Văn ${String.fromCharCode(65 + i)}`,
  authorRole: i % 3 === 0 ? 'teacher' : 'student', isPinned: i < 2, allowReplies: true,
  status: i < 8 ? 'open' : 'closed', replyCount: Math.floor(Math.random() * 20),
  viewCount: Math.floor(Math.random() * 100), createdAt: '2026-03-10T08:00:00Z', updatedAt: '2026-03-10T10:00:00Z',
}))

export function DiscussionList({ classId }: { classId: string }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = statusFilter === 'all' ? mockThreads : mockThreads.filter((t) => t.status === statusFilter)
  const sorted = [...filtered].sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))

  return (
    <div>
      <PageHeader
        title="Thảo luận"
        breadcrumbs={[{ label: 'Lớp học', href: '/lms/classes' }, { label: 'Thảo luận' }]}
        actions={[{ label: 'Tạo thảo luận', icon: <Plus className="h-4 w-4" />, href: `/lms/classes/${classId}/discussions/new` }]}
      />
      <div className="flex items-center gap-3 mb-4">
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="open">Đang mở</SelectItem>
            <SelectItem value="closed">Đã đóng</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        {sorted.map((thread) => (
          <Card key={thread.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AppAvatar name={thread.authorName} size="sm" role={thread.authorRole === 'teacher' ? 'teacher' : 'student'} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{thread.authorName}</span>
                    <AppBadge role={thread.authorRole === 'teacher' ? 'teacher' : 'student'} size="sm">
                      {thread.authorRole === 'teacher' ? 'GV' : 'HS'}
                    </AppBadge>
                    <span className="text-xs text-muted-foreground">{new Date(thread.createdAt).toLocaleDateString('vi-VN')}</span>
                    {thread.isPinned && <AppBadge semantic="info" size="sm"><Pin className="h-3 w-3 mr-1" /> Ghim</AppBadge>}
                  </div>
                  <Link href={`/lms/classes/${classId}/discussions/${thread.id}`} className="text-sm font-semibold hover:underline cursor-pointer block">
                    {thread.title}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{thread.body.substring(0, 150)}...</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {thread.replyCount}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {thread.viewCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => setDeleteOpen(false)} title="Xóa thảo luận" description="Bạn có chắc muốn xóa thảo luận này?" variant="danger" />
    </div>
  )
}
