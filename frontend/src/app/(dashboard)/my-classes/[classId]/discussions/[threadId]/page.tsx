'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/composite'
import { ConfirmDialog } from '@/components/composite'
import { AppAvatar, AppBadge } from '@/components/base'
import { toast } from 'sonner'
import {
  useGetMyClass,
  useGetDiscussionThread,
  useReplyDiscussion,
  useDeleteReply,
} from '@/features/lms/student/api/student.api'
import type { DiscussionReply } from '@/features/lms/student/types/student.types'

export default function DiscussionThreadPage() {
  const params = useParams<{ classId: string; threadId: string }>()
  const { data: cls } = useGetMyClass(params.classId)
  const { data, isLoading } = useGetDiscussionThread(params.classId, params.threadId)
  const replyMutation = useReplyDiscussion()
  const deleteMutation = useDeleteReply()

  const [replyContent, setReplyContent] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const handleReply = async () => {
    if (!replyContent.trim()) return
    try {
      await replyMutation.mutateAsync({
        classId: params.classId,
        threadId: params.threadId,
        content: replyContent,
      })
      setReplyContent('')
      toast.success('Đã gửi phản hồi')
    } catch {
      toast.error('Gửi phản hồi thất bại')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync({
        classId: params.classId,
        threadId: params.threadId,
        replyId: deleteTarget,
      })
      setDeleteTarget(null)
      toast.success('Đã xóa phản hồi')
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!data) return null

  const { thread, replies } = data

  return (
    <div>
      <PageHeader
        title={thread.title}
        breadcrumbs={[
          { label: 'Lớp học của tôi', href: '/my-classes' },
          { label: cls?.name ?? '...', href: `/my-classes/${params.classId}` },
          { label: 'Thảo luận', href: `/my-classes/${params.classId}/discussions` },
          { label: thread.title },
        ]}
      />

      {/* Thread content */}
      <Card className="mb-6">
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <AppAvatar name={thread.author.name} src={thread.author.avatar} size="sm" />
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
          <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: thread.content }} />
          {thread.attachments && thread.attachments.length > 0 && (
            <div className="space-y-1">
              {thread.attachments.map((f: { name: string; url: string }, i: number) => (
                <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:underline">
                  {f.name}
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className="mb-6" />

      {/* Replies */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-semibold">{replies.length} phản hồi</h3>
        {replies.map((reply: DiscussionReply) => (
          <Card key={reply.id} size="sm">
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AppAvatar name={reply.author.name} src={reply.author.avatar} size="xs" />
                  <span className="text-sm font-medium">{reply.author.name}</span>
                  <AppBadge
                    role={reply.author.role === 'teacher' ? 'teacher' : 'student'}
                    size="sm"
                  >
                    {reply.author.role === 'teacher' ? 'GV' : 'HS'}
                  </AppBadge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(reply.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                {reply.isOwn && (
                  <button
                    onClick={() => setDeleteTarget(reply.id)}
                    className="cursor-pointer text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-sm">{reply.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply form */}
      <Card>
        <CardContent className="space-y-3">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Viết phản hồi..."
            rows={3}
          />
          <Button
            onClick={handleReply}
            disabled={replyMutation.isPending || !replyContent.trim()}
            size="sm"
            className="cursor-pointer"
          >
            {replyMutation.isPending ? 'Đang gửi...' : 'Gửi phản hồi'}
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Xóa phản hồi"
        description="Bạn có chắc muốn xóa phản hồi này?"
        onConfirm={handleDelete}
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
