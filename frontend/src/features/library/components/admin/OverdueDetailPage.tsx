'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/composite'
import { AppBadge, AppSelect, AppTextarea } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { AlertTriangle, Save, User, BookOpen, Calendar, DollarSign } from 'lucide-react'

const processingStatusOptions = [
  { value: 'contacting', label: 'Đang liên hệ' },
  { value: 'notified', label: 'Đã thông báo' },
  { value: 'resolved', label: 'Đã xử lý' },
]

interface MockOverdueDetail {
  id: string
  memberName: string
  memberCode: string
  memberType: string
  email: string
  phone: string
  bookTitle: string
  copyCode: string
  borrowedAt: string
  dueDate: string
  overdueDays: number
  finePerDay: number
  totalFine: number
  processingStatus: string
  note: string
}

const mockData: Record<string, MockOverdueDetail> = {
  '1': {
    id: '1',
    memberName: 'Nguyễn Văn An',
    memberCode: 'TV-2024-001',
    memberType: 'student',
    email: 'an.nv@school.edu.vn',
    phone: '0912345678',
    bookTitle: 'Toán cao cấp - Tập 1',
    copyCode: 'CB-MAT-001',
    borrowedAt: '2026-01-15',
    dueDate: '2026-02-15',
    overdueDays: 25,
    finePerDay: 2000,
    totalFine: 50000,
    processingStatus: 'contacting',
    note: '',
  },
  '2': {
    id: '2',
    memberName: 'Trần Thị Bích',
    memberCode: 'TV-2024-002',
    memberType: 'teacher',
    email: 'bich.tt@school.edu.vn',
    phone: '0987654321',
    bookTitle: 'Giáo trình Ngữ văn 10',
    copyCode: 'CB-LIT-005',
    borrowedAt: '2026-01-20',
    dueDate: '2026-02-20',
    overdueDays: 20,
    finePerDay: 2000,
    totalFine: 40000,
    processingStatus: 'notified',
    note: 'Đã gọi điện nhắc nhở ngày 05/03',
  },
}

export function OverdueDetailPage({ id }: { id: string }) {
  const detail = mockData[id] ?? mockData['1']!
  const [processingStatus, setProcessingStatus] = useState(detail.processingStatus)
  const [note, setNote] = useState(detail.note)

  const handleSave = () => {
    toast.success('Cập nhật trạng thái xử lý thành công')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chi tiết quá hạn"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Lưu thông' },
          { label: 'Quá hạn', href: '/library/circulation/overdue' },
          { label: detail.memberName },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thông tin bạn đọc */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Thông tin bạn đọc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Họ tên:</span>
              <span className="font-medium">{detail.memberName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã thẻ:</span>
              <span className="font-medium">{detail.memberCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loại:</span>
              <span className="font-medium">
                {detail.memberType === 'student' ? 'Học sinh' : detail.memberType === 'teacher' ? 'Giáo viên' : 'Nhân viên'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{detail.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Điện thoại:</span>
              <span className="font-medium">{detail.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin sách quá hạn */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Thông tin sách quá hạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tên sách:</span>
              <span className="font-medium">{detail.bookTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã cá biệt:</span>
              <span className="font-medium">{detail.copyCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Ngày mượn:</span>
              <span className="font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(detail.borrowedAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Hạn trả:</span>
              <span className="font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(detail.dueDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thông tin phạt */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Thông tin quá hạn & tiền phạt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Số ngày quá hạn</p>
              <p className="text-2xl font-bold text-destructive">{detail.overdueDays} ngày</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Phí phạt/ngày</p>
              <p className="text-2xl font-bold flex items-center justify-center gap-1">
                <DollarSign className="h-5 w-5" />
                {detail.finePerDay.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Tổng tiền phạt</p>
              <p className="text-2xl font-bold text-destructive">{detail.totalFine.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cập nhật trạng thái */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cập nhật trạng thái xử lý</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Trạng thái xử lý</label>
            <AppSelect
              options={processingStatusOptions}
              value={processingStatus}
              onChange={setProcessingStatus}
              placeholder="Chọn trạng thái"
            />
            <div className="mt-2">
              <AppBadge semantic={processingStatus === 'resolved' ? 'success' : processingStatus === 'notified' ? 'warning' : 'info'}>
                {processingStatusOptions.find((o) => o.value === processingStatus)?.label ?? ''}
              </AppBadge>
            </div>
          </div>
          <div>
            <AppTextarea
              label="Ghi chú"
              placeholder="Nhập ghi chú xử lý..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} className="cursor-pointer">
              <Save className="mr-2 h-4 w-4" />
              Lưu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
