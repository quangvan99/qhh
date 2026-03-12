import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:8080'

// Matches Camera type: status must be 'online' | 'offline' | 'error', uses lastSeen (not lastHeartbeat)
const mockCameras = [
  {
    id: 'cam-1',
    name: 'Camera cổng chính',
    location: 'Cổng chính',
    ipAddress: '192.168.1.100',
    rtspUrl: 'rtsp://192.168.1.100:554/live',
    status: 'online',
    lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'cam-2',
    name: 'Camera sân trường',
    location: 'Sân trường',
    ipAddress: '192.168.1.101',
    rtspUrl: 'rtsp://192.168.1.101:554/live',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cam-3',
    name: 'Camera hành lang A',
    location: 'Hành lang A',
    ipAddress: '192.168.1.102',
    rtspUrl: 'rtsp://192.168.1.102:554/live',
    status: 'error',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
]

// Matches FaceProfile type: uses enrolledAt, status ('active'|'pending'), thumbnail
const mockFaceProfiles = [
  {
    id: 'face-1',
    studentId: 'stu-1',
    studentName: 'Nguyễn Thị Lan',
    studentCode: 'HS001',
    photoCount: 5,
    enrolledAt: '2025-02-01T07:00:00Z',
    status: 'active',
    thumbnail: '',
  },
  {
    id: 'face-2',
    studentId: 'stu-2',
    studentName: 'Trần Văn Minh',
    studentCode: 'HS002',
    photoCount: 3,
    enrolledAt: '2025-01-15T07:00:00Z',
    status: 'pending',
    thumbnail: '',
  },
]

// Matches AttendanceSession type: uses startedAt/endedAt, status includes 'scheduled', has lateCount
const mockSessions = [
  {
    id: 'att-session-1',
    className: 'Lớp 10A1',
    classId: 'class-1',
    startedAt: '2025-03-10T07:00:00Z',
    endedAt: '2025-03-10T11:30:00Z',
    status: 'completed',
    presentCount: 33,
    absentCount: 2,
    lateCount: 1,
  },
  {
    id: 'att-session-2',
    className: 'Lớp 11B2',
    classId: 'class-2',
    startedAt: '2025-03-12T07:00:00Z',
    endedAt: null,
    status: 'active',
    presentCount: 28,
    absentCount: 2,
    lateCount: 0,
  },
  {
    id: 'att-session-3',
    className: 'Lớp 10A2',
    classId: 'class-3',
    startedAt: null,
    endedAt: null,
    status: 'scheduled',
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
  },
]

// Matches AttendanceRecord type: uses detectedAt, confidence, isManualOverride
const mockRecords = [
  {
    id: 'rec-1',
    studentId: 'stu-1',
    studentName: 'Nguyễn Thị Lan',
    sessionId: 'att-session-1',
    detectedAt: '2025-03-10T07:02:15Z',
    status: 'present',
    confidence: 98.5,
    isManualOverride: false,
  },
  {
    id: 'rec-2',
    studentId: 'stu-2',
    studentName: 'Trần Văn Minh',
    sessionId: 'att-session-1',
    detectedAt: '',
    status: 'absent',
    confidence: null,
    isManualOverride: true,
    overrideReason: 'Nghỉ ốm',
  },
]

export const attendanceHandlers = [
  // Cameras
  http.get(`${BASE}/api/v1/ai-attendance/cameras`, () =>
    HttpResponse.json(mockCameras),
  ),
  http.post(`${BASE}/api/v1/ai-attendance/cameras`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'cam-new', status: 'connecting', ...body }, { status: 201 })
  }),
  http.put(`${BASE}/api/v1/ai-attendance/cameras/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/v1/ai-attendance/cameras/:id`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${BASE}/api/v1/ai-attendance/cameras/test-connection`, () =>
    HttpResponse.json({ success: true, latency: 42 }),
  ),

  // Face profiles
  http.get(`${BASE}/api/v1/ai-attendance/faces`, () =>
    HttpResponse.json(mockFaceProfiles),
  ),
  http.put(`${BASE}/api/v1/ai-attendance/faces/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/v1/ai-attendance/faces/:id`, () => new HttpResponse(null, { status: 204 })),

  // Sessions
  http.get(`${BASE}/api/v1/ai-attendance/sessions`, () =>
    HttpResponse.json(mockSessions),
  ),
  http.get(`${BASE}/api/v1/ai-attendance/sessions/:id`, ({ params }) =>
    HttpResponse.json(mockSessions.find((s) => s.id === params['id']) ?? mockSessions[0]),
  ),
  http.post(`${BASE}/api/v1/ai-attendance/sessions`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'att-session-new', status: 'draft', ...body }, { status: 201 })
  }),
  http.post(`${BASE}/api/v1/ai-attendance/sessions/:id/start`, ({ params }) =>
    HttpResponse.json({ id: params['id'], status: 'active' }),
  ),
  http.post(`${BASE}/api/v1/ai-attendance/sessions/:id/end`, ({ params }) =>
    HttpResponse.json({ id: params['id'], status: 'completed' }),
  ),

  // Records
  http.get(`${BASE}/api/v1/ai-attendance/records`, () =>
    HttpResponse.json(mockRecords),
  ),
  http.put(`${BASE}/api/v1/ai-attendance/records/:recordId/override`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['recordId'], ...body })
  }),

  // Analytics — matches AttendanceAnalytics type
  http.get(`${BASE}/api/v1/ai-attendance/analytics`, () =>
    HttpResponse.json({
      overallRate: 94.5,
      totalSessions: 45,
      avgPresent: 38,
      byClass: [
        { name: '10A1', rate: 95.2 },
        { name: '10A2', rate: 92.5 },
      ],
      dailyTrend: [
        { date: '2025-03-10', rate: 94.0 },
        { date: '2025-03-11', rate: 93.5 },
      ],
    }),
  ),

  // Reports — matches AttendanceReport type
  http.get(`${BASE}/api/v1/ai-attendance/reports`, () =>
    HttpResponse.json([
      { date: '2025-03-10', classId: 'class-1', className: 'Lớp 10A1', present: 38, absent: 2, late: 2, total: 42, attendanceRate: 90.5 },
      { date: '2025-03-10', classId: 'class-2', className: 'Lớp 10A2', present: 35, absent: 3, late: 2, total: 40, attendanceRate: 87.5 },
    ]),
  ),
]
