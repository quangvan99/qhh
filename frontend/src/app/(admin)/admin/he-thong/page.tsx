'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Settings, Shield, Plug, Mail, FileText, CheckCircle, XCircle,
  Save, RefreshCw, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

const ROLES = ['Admin', 'CBQL', 'Giáo viên', 'Học sinh', 'Thủ thư']
const PERMISSIONS = [
  { id: 'manage_students', label: 'QL Học sinh' },
  { id: 'manage_teachers', label: 'QL Giáo viên' },
  { id: 'attendance', label: 'Điểm danh' },
  { id: 'library', label: 'Thư viện' },
  { id: 'elearning', label: 'E-learning' },
  { id: 'exams', label: 'Thi & Kiểm tra' },
  { id: 'reports', label: 'Báo cáo' },
]

const DEFAULT_MATRIX: Record<string, Record<string, boolean>> = {
  Admin: { manage_students: true, manage_teachers: true, attendance: true, library: true, elearning: true, exams: true, reports: true },
  CBQL: { manage_students: true, manage_teachers: true, attendance: true, library: false, elearning: true, exams: true, reports: true },
  'Giáo viên': { manage_students: false, manage_teachers: false, attendance: true, library: false, elearning: true, exams: true, reports: false },
  'Học sinh': { manage_students: false, manage_teachers: false, attendance: false, library: true, elearning: true, exams: false, reports: false },
  'Thủ thư': { manage_students: false, manage_teachers: false, attendance: false, library: true, elearning: false, exams: false, reports: false },
}

const mockAuditLogs = [
  { id: 'log-001', user: 'admin@quochoc.edu.vn', action: 'Cập nhật thông tin trường', target: 'Trường', timestamp: '2025-01-15 14:32:10', ip: '192.168.1.1', status: 'success' },
  { id: 'log-002', user: 'cbql@quochoc.edu.vn', action: 'Thêm giáo viên mới', target: 'GV Nguyễn Thị X', timestamp: '2025-01-15 13:20:05', ip: '192.168.1.5', status: 'success' },
  { id: 'log-003', user: 'admin@quochoc.edu.vn', action: 'Xóa học sinh', target: 'HS Trần Văn Y', timestamp: '2025-01-15 11:45:30', ip: '192.168.1.1', status: 'success' },
  { id: 'log-004', user: 'gv001@quochoc.edu.vn', action: 'Xuất báo cáo điểm danh', target: 'Lớp 10A1', timestamp: '2025-01-15 10:30:00', ip: '192.168.1.20', status: 'success' },
  { id: 'log-005', user: 'unknown@external.com', action: 'Đăng nhập thất bại', target: 'Hệ thống', timestamp: '2025-01-15 09:15:45', ip: '203.0.113.1', status: 'failed' },
  { id: 'log-006', user: 'admin@quochoc.edu.vn', action: 'Reset mật khẩu', target: 'GV Lê Thị Lan', timestamp: '2025-01-14 16:00:00', ip: '192.168.1.1', status: 'success' },
  { id: 'log-007', user: 'thu_vien@quochoc.edu.vn', action: 'Cho mượn sách', target: 'Giải tích 1', timestamp: '2025-01-14 14:20:00', ip: '192.168.1.30', status: 'success' },
  { id: 'log-008', user: 'admin@quochoc.edu.vn', action: 'Cập nhật phân quyền', target: 'Role: Giáo viên', timestamp: '2025-01-14 11:00:00', ip: '192.168.1.1', status: 'success' },
]

function GeneralSettings() {
  const [saving, setSaving] = useState(false)

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" /> Cài đặt cơ bản
        </h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Tên trường</Label>
            <Input defaultValue="THPT Quốc Học Huế" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Năm học hiện tại</Label>
              <Input defaultValue="2024-2025" />
            </div>
            <div className="space-y-1.5">
              <Label>Múi giờ</Label>
              <Input defaultValue="Asia/Ho_Chi_Minh (UTC+7)" readOnly className="bg-muted" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Ngôn ngữ mặc định</Label>
            <Input defaultValue="Tiếng Việt" readOnly className="bg-muted" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold">Logo & Giao diện</h2>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">QH</div>
          <div>
            <Button variant="outline" size="sm" className="gap-2 cursor-pointer" onClick={() => toast.info('Chức năng upload logo đang phát triển')}>
              Tải logo mới
            </Button>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG. Tối đa 2MB</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold">Tính năng hệ thống</h2>
        <div className="space-y-3">
          {[
            { label: 'Điểm danh AI (Face Recognition)', description: 'Nhận diện khuôn mặt tự động', defaultChecked: true },
            { label: 'E-Learning tích hợp', description: 'Cho phép học trực tuyến', defaultChecked: true },
            { label: 'Thông báo Email', description: 'Gửi thông báo tự động qua email', defaultChecked: false },
            { label: 'Thống kê nâng cao', description: 'Báo cáo AI và phân tích dữ liệu', defaultChecked: true },
          ].map((feature) => (
            <div key={feature.label} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{feature.label}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
              <Switch defaultChecked={feature.defaultChecked} />
            </div>
          ))}
        </div>
      </div>

      <Button
        className="cursor-pointer"
        onClick={async () => {
          setSaving(true)
          await new Promise(r => setTimeout(r, 800))
          setSaving(false)
          toast.success('Đã lưu cài đặt!')
        }}
        disabled={saving}
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </Button>
    </div>
  )
}

function PermissionMatrix() {
  const [matrix, setMatrix] = useState(DEFAULT_MATRIX)
  const [saving, setSaving] = useState(false)

  const toggle = (role: string, perm: string) => {
    if (role === 'Admin') return // Admin luôn có tất cả
    setMatrix(prev => ({
      ...prev,
      [role]: { ...(prev[role] ?? {}), [perm]: !(prev[role]?.[perm] ?? false) },
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Ma trận phân quyền</h2>
          <p className="text-xs text-muted-foreground">Click vào ô để bật/tắt quyền. Admin luôn có toàn quyền.</p>
        </div>
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={async () => {
            setSaving(true)
            await new Promise(r => setTimeout(r, 500))
            setSaving(false)
            toast.success('Đã lưu phân quyền!')
          }}
          disabled={saving}
        >
          {saving ? 'Đang lưu...' : 'Lưu phân quyền'}
        </Button>
      </div>

      <div className="rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vai trò</th>
              {PERMISSIONS.map(p => (
                <th key={p.id} className="px-3 py-3 text-center font-medium text-muted-foreground text-xs whitespace-nowrap">{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map(role => (
              <tr key={role} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Shield className={cn('h-4 w-4', role === 'Admin' ? 'text-yellow-500' : 'text-muted-foreground')} />
                    <span className="font-medium text-sm">{role}</span>
                    {role === 'Admin' && <Badge className="bg-yellow-100 text-yellow-700 text-[10px] h-4 px-1">Full</Badge>}
                  </div>
                </td>
                {PERMISSIONS.map(perm => {
                  const enabled = matrix[role]?.[perm.id] ?? false
                  return (
                    <td key={perm.id} className="px-3 py-3 text-center">
                      <button
                        onClick={() => toggle(role, perm.id)}
                        className={cn(
                          'h-7 w-7 rounded-md flex items-center justify-center mx-auto transition-all',
                          enabled
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80',
                          role === 'Admin' && 'cursor-not-allowed'
                        )}
                        disabled={role === 'Admin'}
                      >
                        {enabled ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4 opacity-40" />}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function IntegrationSettings() {
  const [testing, setTesting] = useState(false)

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" /> HUE-S Single Sign-On
          </h2>
          <Badge className="bg-green-100 text-green-700">Đã kết nối</Badge>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>HUE-S URL</Label>
            <Input defaultValue="https://sso.hue.edu.vn" />
          </div>
          <div className="space-y-1.5">
            <Label>Client ID</Label>
            <Input defaultValue="quochoc-lms-2024" />
          </div>
          <div className="space-y-1.5">
            <Label>Client Secret</Label>
            <Input type="password" defaultValue="••••••••••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label>Redirect URI</Label>
            <Input defaultValue="https://quochoc.edu.vn/api/auth/callback/hues" readOnly className="bg-muted" />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 cursor-pointer"
          onClick={async () => {
            setTesting(true)
            await new Promise(r => setTimeout(r, 1500))
            setTesting(false)
            toast.success('Kết nối thành công! Thời gian phản hồi: 124ms')
          }}
          disabled={testing}
        >
          <RefreshCw className={cn('h-4 w-4', testing && 'animate-spin')} />
          {testing ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold">AI Face Recognition API</h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>API Endpoint</Label>
            <Input defaultValue="https://ai.quochoc.edu.vn/face-api/v2" />
          </div>
          <div className="space-y-1.5">
            <Label>API Key</Label>
            <Input type="password" defaultValue="••••••••••••••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label>Ngưỡng tin cậy</Label>
            <Input type="number" defaultValue="85" min="50" max="100" />
            <p className="text-xs text-muted-foreground">% — Dưới ngưỡng này sẽ cần xác nhận thủ công</p>
          </div>
        </div>
      </div>

      <Button className="cursor-pointer" onClick={() => toast.success('Đã lưu cài đặt tích hợp!')}>
        <Save className="h-4 w-4 mr-2" /> Lưu cài đặt
      </Button>
    </div>
  )
}

function EmailSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" /> Cài đặt Email (SMTP)
        </h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>SMTP Server</Label>
              <Input defaultValue="smtp.gmail.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Port</Label>
              <Input type="number" defaultValue="587" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email gửi</Label>
            <Input defaultValue="noreply@quochoc.edu.vn" />
          </div>
          <div className="space-y-1.5">
            <Label>Mật khẩu</Label>
            <Input type="password" defaultValue="••••••••" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold">Cài đặt SMS</h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>SMS Provider</Label>
            <Input defaultValue="Viettel SMS Gateway" />
          </div>
          <div className="space-y-1.5">
            <Label>API Key</Label>
            <Input type="password" defaultValue="••••••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label>Brandname</Label>
            <Input defaultValue="QUOC HOC" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold">Thông báo tự động</h2>
        <div className="space-y-2">
          {[
            { label: 'Vắng không phép qua Email', checked: true },
            { label: 'Vắng không phép qua SMS', checked: false },
            { label: 'Sách quá hạn qua Email', checked: true },
            { label: 'Kỳ thi sắp tới qua Email', checked: true },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm">{item.label}</span>
              <Switch defaultChecked={item.checked} />
            </div>
          ))}
        </div>
      </div>

      <Button className="cursor-pointer" onClick={() => toast.success('Đã lưu cài đặt email/SMS!')}>
        <Save className="h-4 w-4 mr-2" /> Lưu cài đặt
      </Button>
    </div>
  )
}

function AuditLog() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Nhật ký hoạt động</h2>
        <Badge variant="secondary">{mockAuditLogs.length} bản ghi gần nhất</Badge>
      </div>
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Người dùng</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Hành động</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Đối tượng</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Thời gian</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">IP</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {mockAuditLogs.map(log => (
              <tr key={log.id} className={cn('border-t', log.status === 'failed' && 'bg-red-50/50 dark:bg-red-950/20')}>
                <td className="px-4 py-2.5 text-xs font-mono">{log.user}</td>
                <td className="px-4 py-2.5 text-xs">{log.action}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{log.target}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                <td className="px-4 py-2.5">
                  <code className="text-[10px] bg-muted px-1 rounded">{log.ip}</code>
                </td>
                <td className="px-4 py-2.5">
                  {log.status === 'success' ? (
                    <span className="flex items-center gap-1 text-[10px] text-green-600">
                      <CheckCircle className="h-3 w-3" /> Thành công
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-red-600">
                      <AlertCircle className="h-3 w-3" /> Thất bại
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
        <p className="text-sm text-muted-foreground">Quản lý cấu hình, phân quyền và tích hợp hệ thống</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="permissions">Phân quyền</TabsTrigger>
          <TabsTrigger value="integrations">Tích hợp</TabsTrigger>
          <TabsTrigger value="email">Email/SMS</TabsTrigger>
          <TabsTrigger value="logs">Nhật ký</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6"><GeneralSettings /></TabsContent>
        <TabsContent value="permissions" className="mt-6"><PermissionMatrix /></TabsContent>
        <TabsContent value="integrations" className="mt-6"><IntegrationSettings /></TabsContent>
        <TabsContent value="email" className="mt-6"><EmailSettings /></TabsContent>
        <TabsContent value="logs" className="mt-6"><AuditLog /></TabsContent>
      </Tabs>
    </div>
  )
}
