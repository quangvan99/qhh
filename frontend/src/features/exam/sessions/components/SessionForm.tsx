'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/composite/page-header'
import { FormField } from '@/components/composite/form-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useGetSession, useGetSessionCategories } from '../hooks'

export function SessionForm({ sessionId }: { sessionId?: string }) {
  const isEdit = !!sessionId

  const { data: sessionData, isLoading } = useGetSession(sessionId ?? '')
  const { data: catData } = useGetSessionCategories()

  const session = sessionData?.data
  const categories = catData?.data ?? []

  // Flatten categories: năm học → học kỳ
  const flatCats = categories.flatMap((c) => [
    { id: c.id, name: c.name },
    ...(c.children ?? []).map((ch) => ({ id: ch.id, name: `— ${ch.name}` })),
  ])

  // ── Form fields state ──────────────────────────────────────────────────────
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [academicYear, setAcademicYear] = useState('2025-2026')
  const [semester, setSemester] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [showScoreImmediately, setShowScoreImmediately] = useState(false)
  const [showAnswersAfter, setShowAnswersAfter] = useState(false)

  // ── Populate form khi có dữ liệu đợt thi (edit mode) ──────────────────────
  useEffect(() => {
    if (!session) return
    setName(session.name ?? '')
    setCategoryId(session.categoryId ?? '')
    setAcademicYear(session.academicYear ?? '2025-2026')
    setSemester(session.semester ?? '')
    // Date fields: chuyển ISO sang YYYY-MM-DD
    setStartDate(session.startDate ? session.startDate.slice(0, 10) : '')
    setEndDate(session.endDate ? session.endDate.slice(0, 10) : '')
    setDescription(session.description ?? '')
    setShowScoreImmediately(session.showScoreImmediately ?? false)
    setShowAnswersAfter(!!session.showAnswersAfter)
  }, [session])

  const handleSave = () => {
    if (!name.trim()) { toast.error('Vui lòng nhập tên đợt thi'); return }
    if (!startDate) { toast.error('Vui lòng chọn ngày bắt đầu'); return }
    if (!endDate) { toast.error('Vui lòng chọn ngày kết thúc'); return }
    if (startDate > endDate) { toast.error('Ngày kết thúc phải sau ngày bắt đầu'); return }
    toast.success(isEdit ? 'Đã cập nhật đợt thi' : 'Đã tạo đợt thi')
  }

  if (isEdit && isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa đợt thi' : 'Tạo đợt thi'}
        breadcrumbs={[{ label: 'Tổ chức thi', href: '/exam/sessions' }, { label: isEdit ? 'Sửa' : 'Tạo mới' }]}
        actions={[{ label: 'Lưu', onClick: handleSave }]}
      />
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Thông tin đợt thi</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField name="name" label="Tên đợt thi" required>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Kiểm tra giữa kỳ 1"
              />
            </FormField>
            <FormField name="category" label="Danh mục" required>
              <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
                <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                <SelectContent>
                  {flatCats.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="year" label="Năm học" required>
                <Input
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="VD: 2025-2026"
                />
              </FormField>
              <FormField name="semester" label="Học kỳ" required>
                <Select value={semester} onValueChange={(v) => v && setSemester(v)}>
                  <SelectTrigger><SelectValue placeholder="Chọn HK" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">HK1</SelectItem>
                    <SelectItem value="2">HK2</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="startDate" label="Từ ngày" required>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormField>
              <FormField name="endDate" label="Đến ngày" required>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormField>
            </div>
            <FormField name="description" label="Mô tả">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Mô tả đợt thi..."
              />
            </FormField>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Cài đặt</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                id="showScore"
                checked={showScoreImmediately}
                onCheckedChange={setShowScoreImmediately}
              />
              <Label htmlFor="showScore">Hiển thị điểm ngay sau khi nộp bài</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="showAnswer"
                checked={showAnswersAfter}
                onCheckedChange={setShowAnswersAfter}
              />
              <Label htmlFor="showAnswer">Cho phép xem đáp án sau khi thi</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
