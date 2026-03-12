'use client'

import { useState, useMemo } from 'react'
import { PageHeader } from '@/components/composite'
import { AppBadge, AppSelect } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'

interface MockBorrow {
  id: string
  bookTitle: string
  borrowedAt: string
  dueDate: string
  status: 'on_time' | 'near_due' | 'overdue'
}

interface MockMember {
  id: string
  memberCode: string
  fullName: string
  memberType: string
  currentBorrows: number
}

const mockMembers: MockMember[] = [
  { id: 'm1', memberCode: 'TV-2024-001', fullName: 'Nguyễn Văn An', memberType: 'student', currentBorrows: 3 },
  { id: 'm2', memberCode: 'TV-2024-002', fullName: 'Trần Thị Bích', memberType: 'teacher', currentBorrows: 2 },
  { id: 'm3', memberCode: 'TV-2024-003', fullName: 'Lê Hoàng Cường', memberType: 'student', currentBorrows: 1 },
]

const mockBorrows: Record<string, MockBorrow[]> = {
  m1: [
    { id: 'b1', bookTitle: 'Toán cao cấp - Tập 1', borrowedAt: '2026-02-15', dueDate: '2026-03-01', status: 'overdue' },
    { id: 'b2', bookTitle: 'Lập trình Python cơ bản', borrowedAt: '2026-02-20', dueDate: '2026-03-15', status: 'near_due' },
    { id: 'b3', bookTitle: 'Vật lý đại cương', borrowedAt: '2026-03-01', dueDate: '2026-03-29', status: 'on_time' },
  ],
  m2: [
    { id: 'b4', bookTitle: 'Giáo trình Ngữ văn 10', borrowedAt: '2026-02-10', dueDate: '2026-03-10', status: 'overdue' },
    { id: 'b5', bookTitle: 'Phương pháp giảng dạy hiện đại', borrowedAt: '2026-03-05', dueDate: '2026-04-05', status: 'on_time' },
  ],
  m3: [
    { id: 'b6', bookTitle: 'Tiếng Anh giao tiếp', borrowedAt: '2026-03-08', dueDate: '2026-03-22', status: 'near_due' },
  ],
}

const renewDayOptions = [
  { value: '7', label: '7 ngày' },
  { value: '14', label: '14 ngày' },
  { value: '30', label: '30 ngày' },
]

const statusLabel: Record<string, string> = {
  on_time: 'Đúng hạn',
  near_due: 'Sắp hết hạn',
  overdue: 'Quá hạn',
}

const statusSemantic: Record<string, 'success' | 'warning' | 'error'> = {
  on_time: 'success',
  near_due: 'warning',
  overdue: 'error',
}

export function RenewPage() {
  const [memberId, setMemberId] = useState('')
  const [selectedBorrows, setSelectedBorrows] = useState<string[]>([])
  const [renewModalOpen, setRenewModalOpen] = useState(false)
  const [renewDays, setRenewDays] = useState('14')
  const [renewTarget, setRenewTarget] = useState<'selected' | 'single'>('selected')
  const [singleRenewId, setSingleRenewId] = useState('')

  const memberOptions = mockMembers.map((m) => ({
    value: m.id,
    label: `${m.memberCode} - ${m.fullName}`,
  }))

  const selectedMember = mockMembers.find((m) => m.id === memberId) ?? null
  const borrows = memberId ? (mockBorrows[memberId] ?? []) : []

  const now = useMemo(() => Date.now(), [])

  const calcOverdueDays = (dueDate: string) => {
    const diff = Math.floor((now - new Date(dueDate).getTime()) / 86400000)
    return diff > 0 ? diff : 0
  }

  const toggleBorrow = (id: string) => {
    setSelectedBorrows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedBorrows.length === borrows.length) {
      setSelectedBorrows([])
    } else {
      setSelectedBorrows(borrows.map((b) => b.id))
    }
  }

  const openRenewModal = (mode: 'selected' | 'single', borrowId?: string) => {
    setRenewTarget(mode)
    if (mode === 'single' && borrowId) {
      setSingleRenewId(borrowId)
    }
    setRenewDays('14')
    setRenewModalOpen(true)
  }

  const handleConfirmRenew = () => {
    const count = renewTarget === 'single' ? 1 : selectedBorrows.length
    toast.success(`Gia hạn thành công ${count} tài liệu thêm ${renewDays} ngày`)
    setRenewModalOpen(false)
    setSelectedBorrows([])
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gia hạn mượn"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Lưu thông' },
          { label: 'Gia hạn' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tìm bạn đọc</CardTitle>
        </CardHeader>
        <CardContent>
          <AppSelect
            searchable
            options={memberOptions}
            value={memberId}
            onChange={(v) => { setMemberId(v); setSelectedBorrows([]) }}
            placeholder="Quét mã thẻ hoặc nhập mã bạn đọc..."
          />
          {selectedMember && (
            <div className="mt-4 rounded-lg border p-4">
              <p className="font-semibold">{selectedMember.fullName}</p>
              <p className="text-sm text-muted-foreground">
                Mã thẻ: {selectedMember.memberCode} | Loại:{' '}
                {selectedMember.memberType === 'student' ? 'Học sinh' : selectedMember.memberType === 'teacher' ? 'Giáo viên' : 'Nhân viên'} |
                Đang mượn: {selectedMember.currentBorrows}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedMember && borrows.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Sách đang mượn</CardTitle>
            <Button
              size="sm"
              onClick={() => openRenewModal('selected')}
              disabled={selectedBorrows.length === 0}
              className="cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Gia hạn đã chọn ({selectedBorrows.length})
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 w-10">
                      <Checkbox
                        checked={selectedBorrows.length === borrows.length && borrows.length > 0}
                        onCheckedChange={toggleAll}
                      />
                    </th>
                    <th className="px-4 py-2 text-left">Tài liệu</th>
                    <th className="px-4 py-2 text-left">Ngày mượn</th>
                    <th className="px-4 py-2 text-left">Hạn trả</th>
                    <th className="px-4 py-2 text-left">Trạng thái</th>
                    <th className="px-4 py-2 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {borrows.map((borrow) => {
                    const overdueDays = calcOverdueDays(borrow.dueDate)
                    return (
                      <tr key={borrow.id} className={`border-b ${borrow.status === 'overdue' ? 'bg-red-50' : borrow.status === 'near_due' ? 'bg-yellow-50' : ''}`}>
                        <td className="px-4 py-2">
                          <Checkbox
                            checked={selectedBorrows.includes(borrow.id)}
                            onCheckedChange={() => toggleBorrow(borrow.id)}
                          />
                        </td>
                        <td className="px-4 py-2 font-medium">{borrow.bookTitle}</td>
                        <td className="px-4 py-2">{new Date(borrow.borrowedAt).toLocaleDateString('vi-VN')}</td>
                        <td className="px-4 py-2">
                          {new Date(borrow.dueDate).toLocaleDateString('vi-VN')}
                          {overdueDays > 0 && (
                            <span className="ml-2 text-xs text-destructive">({overdueDays} ngày)</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <AppBadge semantic={statusSemantic[borrow.status]}>
                            {statusLabel[borrow.status]}
                          </AppBadge>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openRenewModal('single', borrow.id)}
                            className="cursor-pointer h-8"
                          >
                            <RefreshCw className="mr-1 h-3 w-3" />
                            Gia hạn
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedMember && borrows.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Bạn đọc không có sách đang mượn
          </CardContent>
        </Card>
      )}

      <Dialog open={renewModalOpen} onOpenChange={setRenewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận gia hạn</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {renewTarget === 'single'
                ? `Gia hạn: ${borrows.find((b) => b.id === singleRenewId)?.bookTitle ?? ''}`
                : `Gia hạn ${selectedBorrows.length} tài liệu đã chọn`}
            </p>
            <div>
              <label className="text-sm font-medium mb-2 block">Gia hạn thêm</label>
              <AppSelect
                options={renewDayOptions}
                value={renewDays}
                onChange={setRenewDays}
                placeholder="Chọn số ngày"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenewModalOpen(false)} className="cursor-pointer">
              Hủy
            </Button>
            <Button onClick={handleConfirmRenew} className="cursor-pointer">
              Xác nhận gia hạn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
