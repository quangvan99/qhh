import { useGetClassAnalytics, useGetGradeBook, useGetAtRiskStudents } from './index'

export function useClassAnalytics(classId: string) {
  const analyticsQuery = useGetClassAnalytics(classId)
  const gradebookQuery = useGetGradeBook(classId)
  const atRiskQuery = useGetAtRiskStudents(classId)

  const analytics = analyticsQuery.data?.data ?? null
  const gradebook = gradebookQuery.data?.data ?? null
  const atRiskStudents = atRiskQuery.data?.data ?? []

  const isLoading = analyticsQuery.isLoading || gradebookQuery.isLoading

  return {
    analytics,
    gradebook,
    atRiskStudents,
    isLoading,
    errors: {
      analytics: analyticsQuery.error,
      gradebook: gradebookQuery.error,
      atRisk: atRiskQuery.error,
    },
  }
}
