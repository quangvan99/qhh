import {
  useGetStudentResult,
  useGetContentProgress,
  useGetStudentAssignmentResults,
  useGetStudentExamResults,
  useGetActivityLog,
} from './index'

export function useStudentResult(classId: string, studentId: string) {
  const resultQuery = useGetStudentResult(classId, studentId)
  const contentQuery = useGetContentProgress(classId, studentId)
  const assignmentQuery = useGetStudentAssignmentResults(classId, studentId)
  const examQuery = useGetStudentExamResults(classId, studentId)
  const activityQuery = useGetActivityLog(classId, studentId)

  const result = resultQuery.data?.data ?? null
  const contentProgress = contentQuery.data?.data ?? []
  const assignmentResults = assignmentQuery.data?.data ?? []
  const examResults = examQuery.data?.data ?? []
  const activityLog = activityQuery.data?.data ?? []

  const isLoading =
    resultQuery.isLoading ||
    contentQuery.isLoading ||
    assignmentQuery.isLoading ||
    examQuery.isLoading

  // Derived stats for the student detail view
  const contentStats = {
    total: contentProgress.length,
    completed: contentProgress.filter((c) => c.completed).length,
    totalStudyMinutes: contentProgress.reduce((s, c) => s + c.studyTimeMinutes, 0),
    totalAccess: contentProgress.reduce((s, c) => s + c.accessCount, 0),
  }

  const assignmentStats = {
    total: assignmentResults.length,
    submitted: assignmentResults.filter((a) => a.submittedAt !== undefined).length,
    graded: assignmentResults.filter((a) => a.score !== null).length,
    avg:
      assignmentResults.filter((a) => a.score !== null).length > 0
        ? Math.round(
            (assignmentResults
              .filter((a) => a.score !== null)
              .reduce((s, a) => s + (a.score ?? 0), 0) /
              assignmentResults.filter((a) => a.score !== null).length) *
              10
          ) / 10
        : null,
  }

  const examStats = {
    total: examResults.length,
    taken: examResults.filter((e) => e.score !== null).length,
    best: examResults.reduce((max, e) => (e.score !== null && e.score > (max ?? -1) ? e.score : max), null as number | null),
    avg:
      examResults.filter((e) => e.score !== null).length > 0
        ? Math.round(
            (examResults
              .filter((e) => e.score !== null)
              .reduce((s, e) => s + (e.score ?? 0), 0) /
              examResults.filter((e) => e.score !== null).length) *
              10
          ) / 10
        : null,
  }

  return {
    result,
    contentProgress,
    assignmentResults,
    examResults,
    activityLog,
    isLoading,
    // errors
    errors: {
      result: resultQuery.error,
      content: contentQuery.error,
      assignments: assignmentQuery.error,
      exams: examQuery.error,
      activity: activityQuery.error,
    },
    // derived
    contentStats,
    assignmentStats,
    examStats,
  }
}
