'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AppInput, AppButton, AppSelect } from '@/components/base'
import { useManualOverrideAttendance } from '../api/attendance.api'
import { toast } from 'sonner'

interface ManualOverrideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionId: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- sessionId reserved for filtering
export function ManualOverrideModal({ open, onOpenChange, sessionId }: ManualOverrideModalProps) {
  const [studentSearch, setStudentSearch] = useState('')
  const [status, setStatus] = useState<'present' | 'absent' | 'late'>('present')
  const [reason, setReason] = useState('')
  const override = useManualOverrideAttendance()

  const studentOptions = [
    { value: 'r1', label: 'Nguyễn Văn An' },
    { value: 'r2', label: 'Trần Thị Bình' },
    { value: 'r3', label: 'Lê Hoàng Cường' },
    { value: 'r4', label: 'Phạm Minh Đức' },
  ]

  const statusOptions = [
    { value: 'present', label: 'Có mặt' },
    { value: 'absent', label: 'Vắng' },
    { value: 'late', label: 'Muộn' },
  ]

  const handleSubmit = async () => {
    if (!studentSearch) {
      toast.error('Vui lòng chọn học sinh')
      return
    }
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do')
      return
    }
    try {
      await override.mutateAsync({ recordId: studentSearch, status, reason })
      toast.success('Cập nhật điểm danh thành công')
      onOpenChange(false)
      setStudentSearch('')
      setReason('')
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa điểm danh thủ công</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <AppSelect
            label="Học sinh"
            options={studentOptions}
            value={studentSearch}
            onChange={setStudentSearch}
            placeholder="Tìm và chọn học sinh..."
            searchable
            required
          />
          <AppSelect
            label="Trạng thái"
            options={statusOptions}
            value={status}
            onChange={(v) => setStatus(v as 'present' | 'absent' | 'late')}
            required
          />
          <AppInput
            label="Lý do"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do chỉnh sửa..."
            required
          />
        </div>
        <DialogFooter className="gap-2">
          <AppButton variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </AppButton>
          <AppButton module="ai" loading={override.isPending} onClick={() => void handleSubmit()}>
            Xác nhận
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
