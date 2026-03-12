'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { PageHeader } from '@/components/composite/page-header'
import { toast } from 'sonner'

interface LmsRoleFormProps {
  roleId?: string
}

type PermAction = 'view' | 'create' | 'edit' | 'delete'

interface PermFunction {
  key: string
  label: string
}

const permTabs: { key: string; label: string; functions: PermFunction[] }[] = [
  {
    key: 'classes',
    label: 'Lớp học',
    functions: [
      { key: 'class_list', label: 'Danh sách lớp' },
      { key: 'class_members', label: 'Thành viên lớp' },
      { key: 'class_settings', label: 'Cài đặt lớp' },
    ],
  },
  {
    key: 'content',
    label: 'Nội dung',
    functions: [
      { key: 'content_scorm', label: 'SCORM' },
      { key: 'content_video', label: 'Video' },
      { key: 'content_file', label: 'Tài liệu' },
      { key: 'content_survey', label: 'Khảo sát' },
    ],
  },
  {
    key: 'assignments',
    label: 'Bài tập',
    functions: [
      { key: 'assignment_manage', label: 'Quản lý bài tập' },
      { key: 'assignment_grade', label: 'Chấm điểm' },
      { key: 'assignment_submit', label: 'Nộp bài' },
    ],
  },
  {
    key: 'exams',
    label: 'Đề thi',
    functions: [
      { key: 'exam_bank', label: 'Ngân hàng câu hỏi' },
      { key: 'exam_create', label: 'Tạo đề thi' },
      { key: 'exam_session', label: 'Ca thi' },
    ],
  },
  {
    key: 'reports',
    label: 'Báo cáo',
    functions: [
      { key: 'report_progress', label: 'Tiến độ học tập' },
      { key: 'report_results', label: 'Kết quả' },
      { key: 'report_attendance', label: 'Điểm danh' },
    ],
  },
]

const actions: { key: PermAction; label: string }[] = [
  { key: 'view', label: 'Xem' },
  { key: 'create', label: 'Tạo' },
  { key: 'edit', label: 'Sửa' },
  { key: 'delete', label: 'Xóa' },
]

export function LmsRoleForm({ roleId }: LmsRoleFormProps) {
  const router = useRouter()
  const isEdit = !!roleId
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState(isEdit ? 'Giảng viên' : '')
  const [description, setDescription] = useState(isEdit ? 'Giảng viên/Giáo viên' : '')

  // Permission matrix state: { "class_list:view": true, ... }
  const [perms, setPerms] = useState<Record<string, boolean>>(() => {
    if (!isEdit) return {}
    // Mock: teacher has view on everything, create/edit on content & assignments
    const initial: Record<string, boolean> = {}
    for (const tab of permTabs) {
      for (const fn of tab.functions) {
        initial[`${fn.key}:view`] = true
        if (['content', 'assignments'].includes(tab.key)) {
          initial[`${fn.key}:create`] = true
          initial[`${fn.key}:edit`] = true
        }
      }
    }
    return initial
  })

  const togglePerm = (funcKey: string, action: PermAction) => {
    const key = `${funcKey}:${action}`
    setPerms((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    if (!name) {
      toast.error('Tên vai trò là bắt buộc')
      return
    }
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      toast.success(isEdit ? 'Đã cập nhật vai trò' : 'Đã tạo vai trò')
      router.push('/lms/roles')
    }, 800)
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Chỉnh sửa vai trò LMS' : 'Tạo vai trò LMS mới'}
        breadcrumbs={[
          { label: 'LMS', href: '/lms/roles' },
          { label: 'Vai trò', href: '/lms/roles' },
          { label: isEdit ? 'Chỉnh sửa' : 'Tạo mới' },
        ]}
      />

      <div className="space-y-6">
        {/* Basic Info */}
        <Card className="max-w-2xl">
          <CardHeader><CardTitle className="text-base">Thông tin vai trò</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Tên vai trò <span className="text-red-500">*</span></Label>
              <Input id="roleName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên vai trò" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleDesc">Mô tả</Label>
              <Textarea id="roleDesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả vai trò..." rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* Permission Matrix */}
        <Card>
          <CardHeader><CardTitle className="text-base">Ma trận phân quyền</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="classes">
              <TabsList>
                {permTabs.map((tab) => (
                  <TabsTrigger key={tab.key} value={tab.key}>{tab.label}</TabsTrigger>
                ))}
              </TabsList>

              {permTabs.map((tab) => (
                <TabsContent key={tab.key} value={tab.key} className="mt-4">
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">Chức năng</th>
                          {actions.map((a) => (
                            <th key={a.key} className="text-center p-3 font-medium w-24">{a.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tab.functions.map((fn) => (
                          <tr key={fn.key} className="border-t">
                            <td className="p-3">{fn.label}</td>
                            {actions.map((a) => (
                              <td key={a.key} className="text-center p-3">
                                <Checkbox
                                  checked={!!perms[`${fn.key}:${a.key}`]}
                                  onCheckedChange={() => togglePerm(fn.key, a.key)}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo vai trò'}
          </Button>
          <Button variant="outline" onClick={() => router.push('/lms/roles')} className="cursor-pointer">Hủy</Button>
        </div>
      </div>
    </div>
  )
}
