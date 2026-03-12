import { useState, useMemo } from 'react'
import {
  useGetDiscussions,
  useCreateDiscussion,
  useUpdateDiscussion,
  useDeleteDiscussion,
  useTogglePin,
  useToggleClose,
} from './index'
import type { DiscussionStatus } from '../types'

export function useDiscussions(classId: string) {
  const [statusFilter, setStatusFilter] = useState<DiscussionStatus | 'all'>('all')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'mostReplies'>('newest')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'teacher' | 'student'>('all')

  const { data, isLoading, error } = useGetDiscussions(classId, {
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })

  const createMutation = useCreateDiscussion(classId)
  const updateMutation = useUpdateDiscussion(classId)
  const deleteMutation = useDeleteDiscussion(classId)
  const pinMutation = useTogglePin(classId)
  const closeMutation = useToggleClose(classId)

  const threads = useMemo(() => {
    let list = data?.data ?? []

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q) ||
          t.authorName.toLowerCase().includes(q)
      )
    }

    if (roleFilter !== 'all') {
      list = list.filter((t) => t.authorRole === roleFilter)
    }

    const sorted = [...list]
    if (sort === 'newest') sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (sort === 'oldest') sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    if (sort === 'mostReplies') sorted.sort((a, b) => b.replyCount - a.replyCount)

    // Pinned always on top
    return [...sorted.filter((t) => t.isPinned), ...sorted.filter((t) => !t.isPinned)]
  }, [data, search, roleFilter, sort])

  const stats = useMemo(() => {
    const all = data?.data ?? []
    return {
      total: all.length,
      open: all.filter((t) => t.status === 'open').length,
      closed: all.filter((t) => t.status === 'closed').length,
      pinned: all.filter((t) => t.isPinned).length,
      byTeacher: all.filter((t) => t.authorRole === 'teacher').length,
      byStudent: all.filter((t) => t.authorRole === 'student').length,
      totalReplies: all.reduce((s, t) => s + t.replyCount, 0),
    }
  }, [data])

  return {
    threads,
    total: data?.pagination?.total ?? 0,
    isLoading,
    error,
    stats,
    // filters
    statusFilter, setStatusFilter,
    sort, setSort,
    search, setSearch,
    roleFilter, setRoleFilter,
    // mutations
    createDiscussion: createMutation.mutateAsync,
    updateDiscussion: updateMutation.mutateAsync,
    deleteDiscussion: deleteMutation.mutateAsync,
    togglePin: pinMutation.mutateAsync,
    toggleClose: closeMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
