import { useState, useCallback, useMemo } from 'react'
import {
  useGetAssignments,
  useCreateAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
} from './index'
import type { Assignment, AssignmentStatus } from '../types'

export function useAssignments(classId: string) {
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'all'>('all')
  const [sort, setSort] = useState<'deadline' | 'title' | 'createdAt'>('deadline')
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useGetAssignments(classId, {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sort,
  })

  const createMutation = useCreateAssignment(classId)
  const updateMutation = useUpdateAssignment(classId, '')
  const deleteMutation = useDeleteAssignment(classId)

  const assignments: Assignment[] = useMemo(() => {
    const list = data?.data ?? []
    if (!search.trim()) return list
    return list.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  const stats = useMemo(() => ({
    total: assignments.length,
    open: assignments.filter((a) => a.status === 'open').length,
    draft: assignments.filter((a) => a.status === 'draft').length,
    closed: assignments.filter((a) => a.status === 'closed').length,
    submissionRate: assignments.length
      ? Math.round(
          (assignments.reduce((s, a) => s + a.submittedCount, 0) /
            Math.max(assignments.reduce((s, a) => s + a.totalStudents, 0), 1)) *
            100
        )
      : 0,
  }), [assignments])

  const resetFilters = useCallback(() => {
    setStatusFilter('all')
    setSort('deadline')
    setSearch('')
  }, [])

  return {
    assignments,
    total: data?.pagination?.total ?? 0,
    isLoading,
    error,
    stats,
    // filters
    statusFilter, setStatusFilter,
    sort, setSort,
    search, setSearch,
    resetFilters,
    // mutations
    createAssignment: createMutation.mutateAsync,
    updateAssignment: updateMutation.mutateAsync,
    deleteAssignment: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
