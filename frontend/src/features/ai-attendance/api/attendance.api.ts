import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type {
  Camera,
  AttendanceDevice,
  FaceProfile,
  AttendanceRecord,
  AttendanceSession,
  MonitorFeedEntry,
  AttendanceReport,
  AttendanceAnalytics,
} from '../types/attendance.types'

// ─── Mock Data ──────────────────────────────────────────────────

const MOCK_CAMERAS: Camera[] = [
  { id: '1', name: 'Camera Cổng chính', ipAddress: '192.168.1.101', rtspUrl: 'rtsp://192.168.1.101/stream1', location: 'Cổng chính', status: 'online', lastSeen: new Date().toISOString(), manufacturer: 'Hikvision' },
  { id: '2', name: 'Camera Sân trường', ipAddress: '192.168.1.102', location: 'Sân trường', status: 'online', lastSeen: new Date().toISOString(), manufacturer: 'Dahua' },
  { id: '3', name: 'Camera Phòng học 10A1', ipAddress: '192.168.1.103', rtspUrl: 'rtsp://192.168.1.103/stream1', location: 'Phòng 10A1', classId: 'c1', status: 'offline', lastSeen: new Date(Date.now() - 3600000).toISOString() },
  { id: '4', name: 'Camera Thư viện', ipAddress: '192.168.1.104', location: 'Thư viện', status: 'error', lastSeen: new Date(Date.now() - 7200000).toISOString(), manufacturer: 'Hikvision' },
]

const MOCK_DEVICES: AttendanceDevice[] = [
  { id: '1', deviceId: 'DEV-001', model: 'ZKTeco SpeedFace V5L', firmware: 'v2.1.3', classId: 'c1', status: 'active' },
  { id: '2', deviceId: 'DEV-002', model: 'ZKTeco SpeedFace V5L', firmware: 'v2.1.3', classId: 'c2', status: 'active' },
  { id: '3', deviceId: 'DEV-003', model: 'Hikvision DS-K1T671', firmware: 'v1.0.5', status: 'inactive' },
]

const MOCK_FACE_PROFILES: FaceProfile[] = [
  { id: '1', studentId: 's1', studentName: 'Nguyễn Văn An', studentCode: 'HS2024001', photoCount: 5, enrolledAt: '2024-09-01T08:00:00Z', status: 'active', thumbnail: '' },
  { id: '2', studentId: 's2', studentName: 'Trần Thị Bình', studentCode: 'HS2024002', photoCount: 3, enrolledAt: '2024-09-01T08:15:00Z', status: 'active', thumbnail: '' },
  { id: '3', studentId: 's3', studentName: 'Lê Hoàng Cường', studentCode: 'HS2024003', photoCount: 0, enrolledAt: '2024-09-02T10:00:00Z', status: 'pending', thumbnail: '' },
  { id: '4', studentId: 's4', studentName: 'Phạm Minh Đức', studentCode: 'HS2024004', photoCount: 4, enrolledAt: '2024-09-03T09:00:00Z', status: 'active', thumbnail: '' },
  { id: '5', studentId: 's5', studentName: 'Hoàng Thị Em', studentCode: 'HS2024005', photoCount: 2, enrolledAt: '2024-09-03T09:30:00Z', status: 'pending', thumbnail: '' },
]

const MOCK_SESSIONS: AttendanceSession[] = [
  { id: '1', classId: 'c1', className: 'Lớp 10A1', startedAt: '2024-12-10T07:00:00Z', endedAt: '2024-12-10T11:30:00Z', status: 'completed', presentCount: 38, absentCount: 2, lateCount: 2 },
  { id: '2', classId: 'c2', className: 'Lớp 10A2', startedAt: '2024-12-10T07:00:00Z', status: 'active', presentCount: 35, absentCount: 3, lateCount: 2 },
  { id: '3', classId: 'c3', className: 'Lớp 11B1', status: 'scheduled', presentCount: 0, absentCount: 0, lateCount: 0 },
  { id: '4', classId: 'c1', className: 'Lớp 10A1', startedAt: '2024-12-09T07:00:00Z', endedAt: '2024-12-09T11:30:00Z', status: 'completed', presentCount: 40, absentCount: 1, lateCount: 1 },
]

const MOCK_RECORDS: AttendanceRecord[] = [
  { id: '1', studentId: 's1', studentName: 'Nguyễn Văn An', sessionId: '2', detectedAt: '2024-12-10T07:02:00Z', status: 'present', confidence: 98.5, isManualOverride: false },
  { id: '2', studentId: 's2', studentName: 'Trần Thị Bình', sessionId: '2', detectedAt: '2024-12-10T07:05:00Z', status: 'present', confidence: 95.2, isManualOverride: false },
  { id: '3', studentId: 's3', studentName: 'Lê Hoàng Cường', sessionId: '2', detectedAt: '2024-12-10T07:15:00Z', status: 'late', confidence: 92.1, isManualOverride: false },
  { id: '4', studentId: 's4', studentName: 'Phạm Minh Đức', sessionId: '2', detectedAt: '', status: 'absent', isManualOverride: true, overrideReason: 'Nghỉ ốm' },
]

const MOCK_REPORTS: AttendanceReport[] = [
  { date: '2024-12-10', classId: 'c1', className: 'Lớp 10A1', present: 38, absent: 2, late: 2, total: 42, attendanceRate: 90.5 },
  { date: '2024-12-10', classId: 'c2', className: 'Lớp 10A2', present: 35, absent: 3, late: 2, total: 40, attendanceRate: 87.5 },
  { date: '2024-12-09', classId: 'c1', className: 'Lớp 10A1', present: 40, absent: 1, late: 1, total: 42, attendanceRate: 95.2 },
  { date: '2024-12-09', classId: 'c2', className: 'Lớp 10A2', present: 37, absent: 2, late: 1, total: 40, attendanceRate: 92.5 },
]

const MOCK_ANALYTICS: AttendanceAnalytics = {
  overallRate: 91.3,
  totalSessions: 245,
  avgPresent: 38,
  byClass: [
    { name: '10A1', rate: 95.2 },
    { name: '10A2', rate: 92.5 },
    { name: '11B1', rate: 88.1 },
    { name: '11B2', rate: 90.3 },
    { name: '12A1', rate: 93.7 },
  ],
  dailyTrend: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0] ?? '',
    rate: 85 + Math.random() * 12,
  })),
}

// ─── Cameras ────────────────────────────────────────────────────

export function useGetCameras() {
  return useQuery({
    queryKey: ['ai-attendance', 'cameras'],
    queryFn: async () => {
      try {
        return await apiFetch<Camera[]>('/api/v1/ai-attendance/cameras')
      } catch {
        return MOCK_CAMERAS
      }
    },
  })
}

export function useCreateCamera() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Camera, 'id' | 'status' | 'lastSeen'>) =>
      apiFetch<Camera>('/api/v1/ai-attendance/cameras', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'cameras'] }) },
  })
}

export function useUpdateCamera() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Camera) =>
      apiFetch<Camera>(`/api/v1/ai-attendance/cameras/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'cameras'] }) },
  })
}

export function useDeleteCamera() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/v1/ai-attendance/cameras/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'cameras'] }) },
  })
}

export function useTestCameraConnection() {
  return useMutation({
    mutationFn: (data: { ipAddress: string; rtspUrl?: string }) =>
      apiFetch<{ success: boolean; latency: number }>('/api/v1/ai-attendance/cameras/test-connection', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}

// ─── Devices ────────────────────────────────────────────────────

export function useGetDevices() {
  return useQuery({
    queryKey: ['ai-attendance', 'devices'],
    queryFn: async () => {
      try {
        return await apiFetch<AttendanceDevice[]>('/api/v1/ai-attendance/devices')
      } catch {
        return MOCK_DEVICES
      }
    },
  })
}

export function useCreateDevice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<AttendanceDevice, 'id'>) =>
      apiFetch<AttendanceDevice>('/api/v1/ai-attendance/devices', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'devices'] }) },
  })
}

export function useUpdateDevice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: AttendanceDevice) =>
      apiFetch<AttendanceDevice>(`/api/v1/ai-attendance/devices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'devices'] }) },
  })
}

export function useDeleteDevice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/v1/ai-attendance/devices/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'devices'] }) },
  })
}

// ─── Face Profiles ──────────────────────────────────────────────

export function useGetFaceProfiles(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ['ai-attendance', 'faces', params],
    queryFn: async () => {
      try {
        const qs = new URLSearchParams()
        if (params?.search) qs.set('search', params.search)
        if (params?.status) qs.set('status', params.status)
        return await apiFetch<FaceProfile[]>(`/api/v1/ai-attendance/faces?${qs.toString()}`)
      } catch {
        let result = MOCK_FACE_PROFILES
        if (params?.search) {
          const q = params.search.toLowerCase()
          result = result.filter(f => f.studentName.toLowerCase().includes(q) || f.studentCode.toLowerCase().includes(q))
        }
        if (params?.status) {
          result = result.filter(f => f.status === params.status)
        }
        return result
      }
    },
  })
}

export function useCreateFaceProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      apiFetch<FaceProfile>('/api/v1/ai-attendance/faces', {
        method: 'POST',
        body: data,
        headers: {},
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'faces'] }) },
  })
}

export function useUpdateFaceProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: FaceProfile) =>
      apiFetch<FaceProfile>(`/api/v1/ai-attendance/faces/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'faces'] }) },
  })
}

export function useDeleteFaceProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/v1/ai-attendance/faces/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'faces'] }) },
  })
}

export function useImportFaceProfiles() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return apiFetch<{ imported: number; errors: { row: number; message: string }[] }>(
        '/api/v1/ai-attendance/faces/import',
        { method: 'POST', body: formData, headers: {} }
      )
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'faces'] }) },
  })
}

// ─── Sessions ───────────────────────────────────────────────────

export function useGetAttendanceSessions() {
  return useQuery({
    queryKey: ['ai-attendance', 'sessions'],
    queryFn: async () => {
      try {
        return await apiFetch<AttendanceSession[]>('/api/v1/ai-attendance/sessions')
      } catch {
        return MOCK_SESSIONS
      }
    },
  })
}

export function useGetSessionDetail(id: string) {
  return useQuery({
    queryKey: ['ai-attendance', 'sessions', id],
    queryFn: async () => {
      try {
        return await apiFetch<AttendanceSession>(`/api/v1/ai-attendance/sessions/${id}`)
      } catch {
        return MOCK_SESSIONS.find(s => s.id === id) ?? MOCK_SESSIONS[0]!
      }
    },
    enabled: !!id,
  })
}

export function useStartSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<AttendanceSession>(`/api/v1/ai-attendance/sessions/${id}/start`, { method: 'POST' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'sessions'] }) },
  })
}

export function useEndSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<AttendanceSession>(`/api/v1/ai-attendance/sessions/${id}/end`, { method: 'POST' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['ai-attendance', 'sessions'] }) },
  })
}

// ─── Records ────────────────────────────────────────────────────

export function useGetAttendanceRecords(params?: {
  sessionId?: string
  date?: string
  classId?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['ai-attendance', 'records', params],
    queryFn: async () => {
      try {
        const qs = new URLSearchParams()
        if (params?.sessionId) qs.set('sessionId', params.sessionId)
        if (params?.date) qs.set('date', params.date)
        if (params?.classId) qs.set('classId', params.classId)
        if (params?.status) qs.set('status', params.status)
        return await apiFetch<AttendanceRecord[]>(`/api/v1/ai-attendance/records?${qs.toString()}`)
      } catch {
        let result = MOCK_RECORDS
        if (params?.sessionId) result = result.filter(r => r.sessionId === params.sessionId)
        if (params?.status) result = result.filter(r => r.status === params.status)
        return result
      }
    },
  })
}

export function useManualOverrideAttendance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { recordId: string; status: 'present' | 'absent' | 'late'; reason: string }) =>
      apiFetch<AttendanceRecord>(`/api/v1/ai-attendance/records/${data.recordId}/override`, {
        method: 'PUT',
        body: JSON.stringify({ status: data.status, reason: data.reason }),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['ai-attendance', 'records'] })
      void qc.invalidateQueries({ queryKey: ['ai-attendance', 'sessions'] })
    },
  })
}

// ─── Monitor ────────────────────────────────────────────────────

export function useGetMonitorFeed(sessionId: string) {
  return useQuery({
    queryKey: ['ai-attendance', 'monitor', sessionId],
    queryFn: async () => {
      try {
        return await apiFetch<MonitorFeedEntry[]>(`/api/v1/ai-attendance/sessions/${sessionId}/feed`)
      } catch {
        return MOCK_RECORDS
          .filter(r => r.sessionId === sessionId)
          .map(r => ({
            id: r.id,
            studentId: r.studentId,
            studentName: r.studentName,
            detectedAt: r.detectedAt,
            status: r.status,
            confidence: r.confidence ?? 0,
          }))
      }
    },
    enabled: !!sessionId,
    refetchInterval: 3000,
  })
}

// ─── Reports ────────────────────────────────────────────────────

export function useGetAttendanceReport(params?: {
  dateFrom?: string
  dateTo?: string
  classId?: string
}) {
  return useQuery({
    queryKey: ['ai-attendance', 'reports', params],
    queryFn: async () => {
      try {
        const qs = new URLSearchParams()
        if (params?.dateFrom) qs.set('dateFrom', params.dateFrom)
        if (params?.dateTo) qs.set('dateTo', params.dateTo)
        if (params?.classId) qs.set('classId', params.classId)
        return await apiFetch<AttendanceReport[]>(`/api/v1/ai-attendance/reports?${qs.toString()}`)
      } catch {
        return MOCK_REPORTS
      }
    },
  })
}

export function useExportAttendanceReport() {
  return useMutation({
    mutationFn: async (params: { dateFrom?: string; dateTo?: string; classId?: string }) => {
      const qs = new URLSearchParams()
      if (params.dateFrom) qs.set('dateFrom', params.dateFrom)
      if (params.dateTo) qs.set('dateTo', params.dateTo)
      if (params.classId) qs.set('classId', params.classId)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
      const response = await fetch(`${baseUrl}/api/v1/ai-attendance/reports/export?${qs.toString()}`)
      if (!response.ok) throw new Error('Export failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance-report-${params.dateFrom ?? 'all'}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    },
  })
}

// ─── Analytics ──────────────────────────────────────────────────

export function useGetAttendanceAnalytics(params?: { dateFrom?: string; dateTo?: string }) {
  return useQuery({
    queryKey: ['ai-attendance', 'analytics', params],
    queryFn: async () => {
      try {
        const qs = new URLSearchParams()
        if (params?.dateFrom) qs.set('dateFrom', params.dateFrom)
        if (params?.dateTo) qs.set('dateTo', params.dateTo)
        return await apiFetch<AttendanceAnalytics>(`/api/v1/ai-attendance/analytics?${qs.toString()}`)
      } catch {
        return MOCK_ANALYTICS
      }
    },
  })
}
