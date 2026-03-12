import { useState, useMemo } from 'react'
import {
  useGetSubmissions,
  useGradeSubmission,
} from './index'
import type { Submission, SubmissionStatus, GradingStatus } from '../types'

export function useSubmissions(assignmentId: string) {
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all')
  const [gradingFilter, setGradingFilter] = useState<GradingStatus | 'all'>('all')

  const { data, isLoading, error } = useGetSubmissions(assignmentId, {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    graded: gradingFilter !== 'all' ? gradingFilter : undefined,
  })

  const gradeMutation = useGradeSubmission()

  const submissions: Submission[] = useMemo(() => {
    const list = data?.data ?? []
    if (statusFilter !== 'all' && gradingFilter !== 'all') {
      return list.filter(
        (s) => s.submissionStatus === statusFilter && s.gradingStatus === gradingFilter
      )
    }
    if (statusFilter !== 'all') return list.filter((s) => s.submissionStatus === statusFilter)
    if (gradingFilter !== 'all') return list.filter((s) => s.gradingStatus === gradingFilter)
    return list
  }, [data, statusFilter, gradingFilter])

  const stats = useMemo(() => {
    const all = data?.data ?? []
    const submitted = all.filter((s) => s.submissionStatus !== 'not_submitted')
    const graded = all.filter((s) => s.gradingStatus === 'graded')
    const scores = graded.map((s) => s.score ?? 0)
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null
    const max = scores.length ? Math.max(...scores) : null
    const min = scores.length ? Math.min(...scores) : null
    return {
      total: all.length,
      submitted: submitted.length,
      late: all.filter((s) => s.submissionStatus === 'late').length,
      notSubmitted: all.filter((s) => s.submissionStatus === 'not_submitted').length,
      graded: graded.length,
      ungraded: submitted.length - graded.length,
      avgScore: avg,
      maxScore: max,
      minScore: min,
    }
  }, [data])

  const navigateTo = (currentIndex: number, direction: 'prev' | 'next') => {
    const list = submissions.filter((s) => s.submissionStatus !== 'not_submitted')
    const next = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    if (next < 0 || next >= list.length) return null
    return list[next] ?? null
  }

  return {
    submissions,
    total: data?.pagination?.total ?? 0,
    isLoading,
    error,
    stats,
    // filters
    statusFilter, setStatusFilter,
    gradingFilter, setGradingFilter,
    // mutations
    gradeSubmission: gradeMutation.mutateAsync,
    isGrading: gradeMutation.isPending,
    // navigation helper
    navigateTo,
  }
}
