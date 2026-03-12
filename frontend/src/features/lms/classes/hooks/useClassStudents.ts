import { useState, useCallback } from "react"
import { useGetClassStudents, useAddStudents, useRemoveStudent, useApproveEnrollment, useBulkApproveEnrollment } from "../api/class.api"
import type { ClassStudent } from "../types/class.types"

type TabFilter = "all" | "pending" | "removed"

export function useClassStudents(classId: string) {
  const [tab, setTab] = useState<TabFilter>("all")

  const statusFilter = tab === "all" ? undefined : tab === "pending" ? "pending" : "removed"

  const { data, isLoading, error } = useGetClassStudents(classId, {
    status: statusFilter,
  })

  const students = data?.data ?? []
  const total = data?.total ?? 0

  const addStudentsMutation = useAddStudents(classId)
  const removeStudentMutation = useRemoveStudent(classId)
  const approveMutation = useApproveEnrollment(classId)
  const bulkApproveMutation = useBulkApproveEnrollment(classId)

  const addStudents = useCallback(
    (studentIds: string[]) => addStudentsMutation.mutateAsync(studentIds),
    [addStudentsMutation]
  )

  const removeStudent = useCallback(
    (studentId: string) => removeStudentMutation.mutateAsync(studentId),
    [removeStudentMutation]
  )

  const approveStudent = useCallback(
    (studentId: string) => approveMutation.mutateAsync(studentId),
    [approveMutation]
  )

  const bulkApprove = useCallback(
    (studentIds: string[]) => bulkApproveMutation.mutateAsync(studentIds),
    [bulkApproveMutation]
  )

  return {
    students,
    total,
    isLoading,
    error,
    tab, setTab,
    // Mutations
    addStudents,
    removeStudent,
    approveStudent,
    bulkApprove,
    isAdding: addStudentsMutation.isPending,
    isRemoving: removeStudentMutation.isPending,
    isApproving: approveMutation.isPending,
  }
}
