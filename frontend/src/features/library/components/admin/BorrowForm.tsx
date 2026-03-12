'use client'

import { useState, useRef, useEffect } from 'react'
import { useGetMembers, useCreateBorrow } from '@/features/library/api/library.api'
import type { LibraryMember, BookCopy } from '@/features/library/types/library.types'
import { PageHeader } from '@/components/composite'
import { AppBadge, AppInput, AppSelect } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

export function BorrowForm() {
  const [memberId, setMemberId] = useState('')
  const [selectedMember, setSelectedMember] = useState<LibraryMember | null>(null)
  const [copyId, setCopyId] = useState('')
  const [selectedCopies, setSelectedCopies] = useState<Array<{ copy: BookCopy; bookTitle: string }>>([])
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().split('T')[0] ?? ''
  })
  const [confirmOpen, setConfirmOpen] = useState(false)

  const memberInputRef = useRef<HTMLInputElement>(null)
  const copyInputRef = useRef<HTMLInputElement>(null)

  const { data: membersData } = useGetMembers({ search: '', memberType: '', status: '' })
  const createBorrow = useCreateBorrow()

  useEffect(() => {
    memberInputRef.current?.focus()
  }, [])

  const memberOptions = membersData?.data?.map((m: LibraryMember) => ({
    value: m.id,
    label: `${m.memberCode} - ${m.fullName}`,
  })) ?? []

  const handleMemberSelect = (value: string) => {
    setMemberId(value)
    const member = membersData?.data?.find((m: LibraryMember) => m.id === value)
    setSelectedMember(member ?? null)
    setTimeout(() => copyInputRef.current?.focus(), 100)
  }

  const isMemberValid = selectedMember &&
    selectedMember.status === 'active' &&
    new Date(selectedMember.cardExpiry) > new Date()

  const handleConfirmBorrow = async () => {
    if (!selectedMember || selectedCopies.length === 0) return
    try {
      for (const item of selectedCopies) {
        await createBorrow.mutateAsync({
          memberId: selectedMember.id,
          copyId: item.copy.id,
          dueDate,
        })
      }
      toast.success(`Ghi mượn thành công ${selectedCopies.length} cuốn`)
      setConfirmOpen(false)
      // Reset
      setSelectedMember(null)
      setMemberId('')
      setCopyId('')
      setSelectedCopies([])
      memberInputRef.current?.focus()
    } catch {
      toast.error('Có lỗi khi ghi mượn')
    }
  }

  const removeCopy = (idx: number) => {
    setSelectedCopies((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ghi mượn tài liệu"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Lưu thông' },
          { label: 'Ghi mượn' },
        ]}
      />

      {/* Member selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin bạn đọc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AppSelect
            searchable
            options={memberOptions}
            value={memberId}
            onChange={handleMemberSelect}
            placeholder="Quét mã thẻ hoặc tìm bạn đọc..."
          />
          {selectedMember && (
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{selectedMember.fullName}</p>
                  <p className="text-sm text-muted-foreground">Mã thẻ: {selectedMember.memberCode}</p>
                </div>
                <AppBadge
                  semantic={isMemberValid ? 'success' : 'error'}
                  dot
                >
                  {isMemberValid ? 'Thẻ hợp lệ' : selectedMember.status === 'suspended' ? 'Bị khóa' : 'Quá hạn'}
                </AppBadge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Loại:</span>{' '}
                  <span className="font-medium">
                    {selectedMember.memberType === 'student' ? 'Học sinh' : selectedMember.memberType === 'teacher' ? 'Giáo viên' : 'Nhân viên'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Đang mượn:</span>{' '}
                  <span className="font-medium">{selectedMember.currentBorrows} / {selectedMember.maxBooks ?? '—'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Hạn thẻ:</span>{' '}
                  <span className="font-medium">{new Date(selectedMember.cardExpiry).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Copy selection — only if member valid */}
      {isMemberValid && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tài liệu mượn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AppInput
              ref={copyInputRef}
              placeholder="Quét mã cá biệt sách..."
              value={copyId}
              onChange={(e) => setCopyId(e.target.value)}
              helper="Nhập mã cá biệt và nhấn Enter"
            />

            {selectedCopies.length > 0 && (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-2 text-left">Mã cá biệt</th>
                      <th className="px-4 py-2 text-left">Tình trạng</th>
                      <th className="px-4 py-2 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCopies.map((item, idx) => (
                      <tr key={item.copy.id} className="border-b">
                        <td className="px-4 py-2">{item.copy.copyCode}</td>
                        <td className="px-4 py-2">
                          <AppBadge semantic={item.copy.isAvailable ? 'success' : 'error'}>
                            {item.copy.isAvailable ? 'Có sẵn' : 'Đang mượn'}
                          </AppBadge>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCopy(idx)}
                            className="cursor-pointer text-destructive hover:text-destructive h-8"
                          >
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <AppInput
                label="Ngày hẹn trả"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => { setSelectedCopies([]); setCopyId('') }}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                onClick={() => setConfirmOpen(true)}
                disabled={selectedCopies.length === 0}
                className="cursor-pointer"
              >
                Xác nhận mượn ({selectedCopies.length} cuốn)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận ghi mượn</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4 text-sm">
            <div><span className="text-muted-foreground">Bạn đọc:</span> <span className="font-medium">{selectedMember?.fullName}</span></div>
            <div><span className="text-muted-foreground">Số tài liệu:</span> <span className="font-medium">{selectedCopies.length} cuốn</span></div>
            <div><span className="text-muted-foreground">Ngày mượn:</span> <span className="font-medium">{new Date().toLocaleDateString('vi-VN')}</span></div>
            <div><span className="text-muted-foreground">Ngày trả:</span> <span className="font-medium">{dueDate ? new Date(dueDate).toLocaleDateString('vi-VN') : '—'}</span></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="cursor-pointer">
              Hủy
            </Button>
            <Button onClick={handleConfirmBorrow} disabled={createBorrow.isPending} className="cursor-pointer">
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
