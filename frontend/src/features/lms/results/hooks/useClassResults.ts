import { useState, useMemo } from 'react'
import {
  useGetClassResults,
  useCompleteResult,
  useUpdateTranscript,
  useSendNotification,
  useAddExamAttempt,
  useExportResults,
  useGetAtRiskStudents,
} from './index'
import type { CompletionStatus } from '../types'

export function useClassResults(classId: string) {
  const [search, setSearch] = useState('')
  const [semester, setSemester] = useState('')
  const [year, setYear] = useState('')
  const [statusFilter, setStatusFilter] = useState<CompletionStatus | 'all'>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { data, isLoading, error } = useGetClassResults(classId, {
    search: search || undefined,
    semester: semester || undefined,
    year: year || undefined,
  })

  const { data: atRiskData } = useGetAtRiskStudents(classId)

  const completeMutation = useCompleteResult(classId)
  const transcriptMutation = useUpdateTranscript(classId)
  const notifyMutation = useSendNotification(classId)
  const addAttemptMutation = useAddExamAttempt(classId)
  const exportMutation = useExportResults(classId)

  const results = useMemo(() => {
    const list = data?.data ?? []
    if (statusFilter === 'all') return list
    return list.filter((r) => r.completionStatus === statusFilter)
  }, [data, statusFilter])

  const stats = useMemo(() => {
    const all = data?.data ?? []
    const finalScores = all.map((r) => r.finalScore).filter((s): s is number => s !== null)
    const avg = finalScores.length
      ? Math.round((finalScores.reduce((a, b) => a + b, 0) / finalScores.length) * 10) / 10
      : null
    return {
      total: all.length,
      completed: all.filter((r) => r.completionStatus === 'completed').length,
      inProgress: all.filter((r) => r.completionStatus === 'in_progress').length,
      notStarted: all.filter((r) => r.completionStatus === 'not_started').length,
      avgFinalScore: avg,
      passCount: finalScores.filter((s) => s >= 5).length,
      failCount: finalScores.filter((s) => s < 5).length,
      atRiskCount: atRiskData?.data?.length ?? 0,
    }
  }, [data, atRiskData])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }
  const selectAll = () => setSelectedIds(results.map((r) => r.studentId))
  const clearSelection = () => setSelectedIds([])

  return {
    results,
    total: data?.pagination?.total ?? 0,
    isLoading,
    error,
    stats,
    // filters
    search, setSearch,
    semester, setSemester,
    year, setYear,
    statusFilter, setStatusFilter,
    // selection
    selectedIds, toggleSelect, selectAll, clearSelection,
    // mutations
    completeResult: completeMutation.mutateAsync,
    updateTranscript: transcriptMutation.mutateAsync,
    sendNotification: notifyMutation.mutateAsync,
    addExamAttempt: addAttemptMutation.mutateAsync,
    exportResults: exportMutation.mutateAsync,
    isCompleting: completeMutation.isPending,
    isUpdatingTranscript: transcriptMutation.isPending,
    isSendingNotification: notifyMutation.isPending,
    isAddingAttempt: addAttemptMutation.isPending,
    isExporting: exportMutation.isPending,
  }
}
