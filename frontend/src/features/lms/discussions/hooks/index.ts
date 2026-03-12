import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { DiscussionThread, DiscussionPost } from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

const keys = {
  discussions: (classId: string) => ['lms', 'discussions', classId] as const,
  thread: (threadId: string) => ['lms', 'discussions', 'thread', threadId] as const,
}

export function useGetDiscussions(classId: string, params?: { status?: string; sort?: string }) {
  return useQuery({
    queryKey: [...keys.discussions(classId), params],
    queryFn: () => apiFetch<PaginatedResponse<DiscussionThread>>(
      `/api/lms/classes/${classId}/discussions?${new URLSearchParams(params as Record<string, string>).toString()}`
    ),
    enabled: !!classId,
  })
}

export function useGetDiscussionThread(threadId: string) {
  return useQuery({
    queryKey: keys.thread(threadId),
    queryFn: () => apiFetch<ApiResponse<{ thread: DiscussionThread; posts: DiscussionPost[] }>>(`/api/discussions/${threadId}`),
    enabled: !!threadId,
  })
}

export function useCreateDiscussion(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<DiscussionThread>) =>
      apiFetch<ApiResponse<DiscussionThread>>(`/api/lms/classes/${classId}/discussions`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.discussions(classId) }) },
  })
}

export function useUpdateDiscussion(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string } & Partial<DiscussionThread>) =>
      apiFetch<ApiResponse<DiscussionThread>>(`/api/lms/classes/${classId}/discussions/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.discussions(classId) }) },
  })
}

export function useDeleteDiscussion(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ApiResponse<void>>(`/api/lms/classes/${classId}/discussions/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.discussions(classId) }) },
  })
}

export function useCreatePost(threadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { content: string; parentId?: string }) =>
      apiFetch<ApiResponse<DiscussionPost>>(`/api/discussions/${threadId}/posts`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.thread(threadId) }) },
  })
}

export function useDeletePost(threadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) =>
      apiFetch<ApiResponse<void>>(`/api/discussions/${threadId}/posts/${postId}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.thread(threadId) }) },
  })
}

export function useTogglePin(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string; pinned: boolean }) =>
      apiFetch<ApiResponse<void>>(`/api/lms/classes/${classId}/discussions/${data.id}/pin`, { method: 'PUT', body: JSON.stringify({ pinned: data.pinned }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.discussions(classId) }) },
  })
}
