'use client'

import { useAdminSummary, useTeacherSummary, useStudentSummary } from '../api/dashboard.api'
import type { UserRole } from '@/types'

export function useDashboardSummary(role?: UserRole) {
  const admin = useAdminSummary()
  const teacher = useTeacherSummary()
  const student = useStudentSummary()

  switch (role) {
    case 'admin':
    case 'principal':
      return { data: admin.data, isLoading: admin.isLoading, error: admin.error }
    case 'teacher':
      return { data: teacher.data, isLoading: teacher.isLoading, error: teacher.error }
    case 'student':
      return { data: student.data, isLoading: student.isLoading, error: student.error }
    default:
      return { data: undefined, isLoading: false, error: null }
  }
}
