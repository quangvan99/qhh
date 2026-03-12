'use client'

import { useDashboardCharts as useDashboardChartsApi } from '../api/dashboard.api'

export function useDashboardChartsHook() {
  const { data, isLoading, error } = useDashboardChartsApi()

  return {
    classStudents: data?.classStudents ?? [],
    attendance7Days: data?.attendance7Days ?? [],
    isLoading,
    error,
  }
}
