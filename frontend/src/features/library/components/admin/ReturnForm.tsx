'use client'

import { useState } from 'react'
import { useGetMembers, useGetBorrows, useReturnBook } from '@/features/library/api/library.api'
import type { LibraryMember, BorrowRecord } from '@/features/library/types/library.types'
import { PageHeader } from '@/components/composite'
import { AppBadge, AppSelect } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

export function ReturnForm() {
  const [memberId, setMemberId] = useState('')
  const [selectedMember, setSelectedMember] = useState<LibraryMember | null>(null)
  const [selectedBorrows, setSelectedBorrows] = useState<string[]>([])
  const [fineModalOpen, setFineModalOpen] = useState(false)
  const [finePaid, setFinePaid] = useState(false)

  const { data: membersData } = useGetMembers({ search: '', memberType: '', status: '' })
  const { data: borrowsData } = useGetBorrows({ status: 'borrowed', memberId: memberId || undefined })
  const returnMut = useReturnBook()

  const memberOptions = membersData?.data?.map((m: LibraryMember) => ({
    value: m.id,
    label: `${m.memberCode} - ${m.fullName}`,
  })) ?? []

  const activeBorrows = borrowsData?.data?.filter((b: BorrowRecord) => b.status === 'borrowed' || b.status === 'overdue') ?? []

  const handleMemberSelect = (value: string) => {
    setMemberId(value)
    const member = membersData?.data?.find((m: LibraryMember) => m.id === value)
    setSelectedMember(member ?? null)
    setSelectedBorrows([])
  }

  const toggleBorrow = (id: string) => {
    setSelectedBorrows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selectedBorrowRecords = activeBorrows.filter((b: BorrowRecord) => selectedBorrows.includes(b.id))
  const totalFine = selectedBorrowRecords.reduce((sum: number, b: BorrowRecord) => sum + (b.fineAmount ?? 0), 0)

  const handleReturn = async () => {
    if (totalFine > 0) {
      setFineModalOpen(true)
      return
    }
    await processReturn()
  }

  const processReturn = async () => {
    try {
      for (const borrow of selectedBorrowRecords) {
        await returnMut.mutateAsync({
          copyId: borrow.copyId,
          finePaid: finePaid || totalFine === 0,
        })
      }
      toast.success(`Ghi trả thành công ${selectedBorrowRecords.length} cuốn`)
      setSelectedBorrows([])
      setFineModalOpen(false)
      setFinePaid(false)
    } catch {
      toast.error('Có lỗi khi ghi trả')
    }
  }

  const [now] = useState(() => Date.now())

  const calcOverdueDays = (dueDate: string) => {
    const diff = Math.floor((now - new Date(dueDate).getTime()) / 86400000)
    return diff > 0 ? diff : 0
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ghi trả tài liệu"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Lưu thông' },
          { label: 'Ghi trả' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chọn bạn đọc</CardTitle>
        </CardHeader>
        <CardContent>
          <AppSelect
            searchable
            options={memberOptions}
            value={memberId}
            onChange={handleMemberSelect}
            placeholder="Quét mã thẻ hoặc tìm bạn đọc..."
          />
          {selectedMember && (
            <div className="mt-4 rounded-lg border p-4">
              <p className="font-semibold">{selectedMember.fullName}</p>
              <p className="text-sm text-muted-foreground">Mã thẻ: {selectedMember.memberCode} | Đang mượn: {selectedMember.currentBorrows}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedMember && activeBorrows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sách đang mượn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 w-10"></th>
                    <th className="px-4 py-2 text-left">Tài liệu</th>
                    <th className="px-4 py-2 text-left">Ngày mượn</th>
                    <th className="px-4 py-2 text-left">Hạn trả</th>
                    <th className="px-4 py-2 text-left">Quá hạn</th>
                    <th className="px-4 py-2 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBorrows.map((borrow: BorrowRecord) => {
                    const overdueDays = calcOverdueDays(borrow.dueDate)
                    return (
                      <tr key={borrow.id} className={`border-b ${overdueDays > 0 ? 'bg-red-50' : ''}`}>
                        <td className="px-4 py-2">
                          <Checkbox
                            checked={selectedBorrows.includes(borrow.id)}
                            onCheckedChange={() => toggleBorrow(borrow.id)}
                          />
                        </td>
                        <td className="px-4 py-2 font-medium">{borrow.bookTitle}</td>
                        <td className="px-4 py-2">{new Date(borrow.borrowedAt).toLocaleDateString('vi-VN')}</td>
                        <td className="px-4 py-2">{new Date(borrow.dueDate).toLocaleDateString('vi-VN')}</td>
                        <td className="px-4 py-2">
                          {overdueDays > 0 ? (
                            <AppBadge semantic="error">{overdueDays} ngày</AppBadge>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-2">
                          <AppBadge semantic={borrow.status === 'overdue' ? 'error' : 'info'}>
                            {borrow.status === 'overdue' ? 'Quá hạn' : 'Đang mượn'}
                          </AppBadge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleReturn}
                disabled={selectedBorrows.length === 0 || returnMut.isPending}
                className="cursor-pointer"
              >
                Xác nhận trả ({selectedBorrows.length} cuốn)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedMember && activeBorrows.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Bạn đọc không có sách đang mượn
          </CardContent>
        </Card>
      )}

      {/* Fine modal */}
      <Dialog open={fineModalOpen} onOpenChange={setFineModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phí phạt quá hạn</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">
              Tổng phí phạt: <span className="text-lg font-bold text-destructive">{totalFine.toLocaleString('vi-VN')}đ</span>
            </p>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={finePaid}
                onCheckedChange={(v) => setFinePaid(!!v)}
                id="fine-paid"
              />
              <label htmlFor="fine-paid" className="text-sm cursor-pointer">
                Xác nhận đã thu phí phạt
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFineModalOpen(false)} className="cursor-pointer">
              Hủy
            </Button>
            <Button onClick={processReturn} disabled={returnMut.isPending} className="cursor-pointer">
              Xác nhận trả
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
