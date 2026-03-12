import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { LMSClass, ClassStudent, ClassDashboardStats, ClassFormData, PaginatedResponse } from "../types/class.types"

const CLASSES_KEY = ["lms", "classes"]

// Classes CRUD
export function useGetClasses(params?: { year?: string; term?: string; status?: string; q?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.year) searchParams.set("year", params.year)
  if (params?.term) searchParams.set("term", params.term)
  if (params?.status) searchParams.set("status", params.status)
  if (params?.q) searchParams.set("q", params.q)
  const qs = searchParams.toString()
  return useQuery({
    queryKey: [...CLASSES_KEY, params],
    queryFn: () => apiFetch<PaginatedResponse<LMSClass>>(`/api/lms/classes${qs ? `?${qs}` : ""}`),
  })
}

export function useGetClass(id: string) {
  return useQuery({
    queryKey: [...CLASSES_KEY, id],
    queryFn: () => apiFetch<LMSClass>(`/api/lms/classes/${id}`),
    enabled: !!id,
  })
}

export function useCreateClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ClassFormData) => apiFetch<LMSClass>("/api/lms/classes", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CLASSES_KEY }) },
  })
}

export function useUpdateClass(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ClassFormData) => apiFetch<LMSClass>(`/api/lms/classes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CLASSES_KEY }) },
  })
}

export function useDeleteClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/api/lms/classes/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CLASSES_KEY }) },
  })
}

export function useCopyClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch<LMSClass>(`/api/lms/classes/${id}/copy`, { method: "POST" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CLASSES_KEY }) },
  })
}

export function useImportClasses() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      return apiFetch<{ success: number; failed: number; errors?: { row: number; message: string }[] }>(
        "/api/lms/classes/import",
        { method: "POST", body: formData, headers: {} }
      )
    },
  })
}

// Dashboard
export function useClassDashboard(params?: { year?: string; term?: string }) {
  return useQuery({
    queryKey: [...CLASSES_KEY, "dashboard", params],
    queryFn: () => apiFetch<ClassDashboardStats>("/api/lms/classes/dashboard-stats"),
  })
}

// Students
const STUDENTS_KEY = (classId: string) => [...CLASSES_KEY, classId, "students"]

export function useGetClassStudents(classId: string, params?: { status?: string }) {
  return useQuery({
    queryKey: [...STUDENTS_KEY(classId), params],
    queryFn: () => apiFetch<PaginatedResponse<ClassStudent>>(`/api/lms/classes/${classId}/students${params?.status ? `?status=${params.status}` : ""}`),
    enabled: !!classId,
  })
}

export function useAddStudents(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (studentIds: string[]) => apiFetch<void>(`/api/lms/classes/${classId}/students/bulk-add`, { method: "POST", body: JSON.stringify({ studentIds }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: STUDENTS_KEY(classId) }) },
  })
}

export function useRemoveStudent(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (studentId: string) => apiFetch<void>(`/api/lms/classes/${classId}/students/${studentId}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: STUDENTS_KEY(classId) }) },
  })
}

export function useApproveEnrollment(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (studentId: string) => apiFetch<void>(`/api/lms/classes/${classId}/students/${studentId}/approve`, { method: "POST" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: STUDENTS_KEY(classId) }) },
  })
}

export function useBulkApproveEnrollment(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (studentIds: string[]) => apiFetch<void>(`/api/lms/classes/${classId}/students/bulk-approve`, { method: "POST", body: JSON.stringify({ studentIds }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: STUDENTS_KEY(classId) }) },
  })
}

// Search available students (not in class)
export function useSearchStudents(query: string) {
  return useQuery({
    queryKey: ["students", "search", query],
    queryFn: () => apiFetch<PaginatedResponse<ClassStudent>>(`/api/users?role=student&q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
  })
}
