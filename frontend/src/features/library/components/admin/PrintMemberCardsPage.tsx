'use client'

import { useState, useMemo, useRef } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppBadge, AppSelect, AppInput } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Printer, FileDown, ChevronRight, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

interface PrintMember {
  id: string
  memberCode: string
  fullName: string
  group: string
  cardExpiry: string
  status: 'active' | 'expired' | 'suspended'
  photo?: string
}

const nameList = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Thị Dung', 'Hoàng Minh Đức',
  'Ngô Thị Hoa', 'Bùi Văn Giang', 'Đỗ Thị Hằng', 'Vũ Văn Kiên', 'Lý Thị Lan',
  'Trương Văn Minh', 'Nguyễn Thị Ngọc', 'Phan Văn Phúc', 'Đặng Thị Quỳnh', 'Hồ Văn Sơn',
]
const groupList = ['Học sinh', 'Giáo viên', 'Cán bộ', 'Sinh viên liên kết', 'Khách']

const mockMembers: PrintMember[] = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  memberCode: `TV${String(i + 1).padStart(4, '0')}`,
  fullName: nameList[i] ?? `Bạn đọc ${i + 1}`,
  group: groupList[i % 5] ?? 'Học sinh',
  cardExpiry: new Date(2026, 6 + Math.floor(i / 3), 15).toISOString(),
  status: i < 12 ? 'active' as const : i === 12 ? 'expired' as const : 'suspended' as const,
}))

const groupOptions = [
  { value: '', label: 'Tất cả nhóm' },
  { value: 'Học sinh', label: 'Học sinh' },
  { value: 'Giáo viên', label: 'Giáo viên' },
  { value: 'Cán bộ', label: 'Cán bộ' },
  { value: 'Sinh viên liên kết', label: 'Sinh viên liên kết' },
  { value: 'Khách', label: 'Khách' },
]

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'expired', label: 'Hết hạn' },
  { value: 'suspended', label: 'Tạm khóa' },
]

const cardSizeOptions = [
  { value: 'standard', label: 'Tiêu chuẩn (85.6 x 54mm)' },
  { value: 'large', label: 'Lớn (100 x 70mm)' },
]

const cardColorOptions = [
  { value: '#1e40af', label: 'Xanh dương' },
  { value: '#059669', label: 'Xanh lá' },
  { value: '#7c3aed', label: 'Tím' },
  { value: '#dc2626', label: 'Đỏ' },
]

const statusLabel: Record<string, string> = { active: 'Hoạt động', expired: 'Hết hạn', suspended: 'Tạm khóa' }

export function PrintMemberCardsPage() {
  const [step, setStep] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filterGroup, setFilterGroup] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterName, setFilterName] = useState('')
  const [cardSize, setCardSize] = useState('standard')
  const [cardColor, setCardColor] = useState('#1e40af')
  const [showQR, setShowQR] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  const filteredMembers = useMemo(() => {
    return mockMembers.filter((m) => {
      if (filterGroup && m.group !== filterGroup) return false
      if (filterStatus && m.status !== filterStatus) return false
      if (filterName && !m.fullName.toLowerCase().includes(filterName.toLowerCase())) return false
      return true
    })
  }, [filterGroup, filterStatus, filterName])

  const selectedMembers = useMemo(() => {
    return mockMembers.filter((m) => selectedIds.has(m.id))
  }, [selectedIds])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredMembers.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredMembers.map((m) => m.id)))
    }
  }

  const columns: ColumnDef<PrintMember, unknown>[] = [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={filteredMembers.length > 0 && selectedIds.size === filteredMembers.length}
          onCheckedChange={toggleSelectAll}
        />
      ),
      size: 50,
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.has(row.original.id)}
          onCheckedChange={() => toggleSelect(row.original.id)}
        />
      ),
    },
    { accessorKey: 'memberCode', header: 'Mã thẻ', size: 110 },
    { accessorKey: 'fullName', header: 'Họ tên' },
    { accessorKey: 'group', header: 'Nhóm', size: 140 },
    {
      accessorKey: 'cardExpiry',
      header: 'Hạn thẻ',
      size: 120,
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 120,
      cell: ({ getValue }) => {
        const val = getValue<string>()
        const semantic = val === 'active' ? 'success' : val === 'expired' ? 'warning' : 'error'
        return <AppBadge semantic={semantic}>{statusLabel[val] ?? val}</AppBadge>
      },
    },
  ]

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    toast.success('Đã xuất file PDF (mock)')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="In thẻ bạn đọc"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Bạn đọc', href: '/library/members' },
          { label: 'In thẻ' },
        ]}
      />

      {/* Stepper */}
      <div className="flex items-center gap-2 text-sm">
        {[
          { num: 1, label: 'Chọn bạn đọc' },
          { num: 2, label: 'Thiết kế mẫu thẻ' },
          { num: 3, label: 'In thẻ' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center gap-2">
            {idx > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <button
              onClick={() => s.num <= step && setStep(s.num)}
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                step === s.num ? 'bg-primary text-primary-foreground' : step > s.num ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}
            >
              <span>{s.num}</span>
              <span>{s.label}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Step 1: Select members */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <AppInput
              placeholder="Tìm theo tên..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-56"
            />
            <AppSelect
              options={groupOptions}
              value={filterGroup}
              onChange={setFilterGroup}
              placeholder="Nhóm"
              className="w-44"
            />
            <AppSelect
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Trạng thái"
              className="w-40"
            />
            <span className="text-sm text-muted-foreground ml-auto">
              Đã chọn: <strong>{selectedIds.size}</strong> bạn đọc
            </span>
          </div>

          <DataTable<PrintMember>
            data={filteredMembers}
            columns={columns}
            loading={false}
          />

          <div className="flex justify-end">
            <Button
              onClick={() => setStep(2)}
              disabled={selectedIds.size === 0}
              className="cursor-pointer"
            >
              Tiếp tục <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Card design */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tùy chọn mẫu thẻ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AppSelect
                  label="Kích thước thẻ"
                  options={cardSizeOptions}
                  value={cardSize}
                  onChange={setCardSize}
                />
                <AppSelect
                  label="Màu nền"
                  options={cardColorOptions}
                  value={cardColor}
                  onChange={setCardColor}
                />
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={showQR}
                    onCheckedChange={(v) => setShowQR(!!v)}
                  />
                  <label className="text-sm">In mã QR trên thẻ</label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Xem trước mẫu thẻ</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="rounded-lg p-4 text-white relative overflow-hidden"
                  style={{
                    backgroundColor: cardColor,
                    width: cardSize === 'standard' ? '320px' : '380px',
                    minHeight: cardSize === 'standard' ? '200px' : '240px',
                  }}
                >
                  <div className="text-xs font-bold uppercase tracking-wide opacity-80">Thư viện QH</div>
                  <div className="text-lg font-bold mt-3">THẺ BẠN ĐỌC</div>
                  <div className="flex items-start gap-3 mt-3">
                    <div className="w-14 h-18 bg-white/30 rounded flex items-center justify-center text-xs">
                      Ảnh
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{selectedMembers[0]?.fullName ?? 'Nguyễn Văn A'}</div>
                      <div className="text-xs opacity-80 mt-1">Mã thẻ: {selectedMembers[0]?.memberCode ?? 'TV0001'}</div>
                      <div className="text-xs opacity-80 mt-0.5">Nhóm: {selectedMembers[0]?.group ?? 'Học sinh'}</div>
                      <div className="text-xs opacity-80 mt-0.5">
                        HSD: {selectedMembers[0] ? new Date(selectedMembers[0].cardExpiry).toLocaleDateString('vi-VN') : '15/07/2026'}
                      </div>
                    </div>
                    {showQR && (
                      <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                        <span className="text-[8px] text-gray-500 text-center leading-tight">QR Code</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)} className="cursor-pointer">
              <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
            </Button>
            <Button onClick={() => setStep(3)} className="cursor-pointer">
              Tiếp tục <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Print */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 print:hidden">
            <Button onClick={handlePrint} className="cursor-pointer">
              <Printer className="h-4 w-4 mr-2" /> In thẻ
            </Button>
            <Button variant="outline" onClick={handleExportPDF} className="cursor-pointer">
              <FileDown className="h-4 w-4 mr-2" /> Xuất PDF
            </Button>
            <span className="text-sm text-muted-foreground">
              Tổng: {selectedMembers.length} thẻ
            </span>
          </div>

          <div ref={printRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-2">
            {selectedMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-lg p-4 text-white relative overflow-hidden print:break-inside-avoid"
                style={{
                  backgroundColor: cardColor,
                  minHeight: cardSize === 'standard' ? '180px' : '210px',
                }}
              >
                <div className="text-xs font-bold uppercase tracking-wide opacity-80">Thư viện QH</div>
                <div className="text-base font-bold mt-2">THẺ BẠN ĐỌC</div>
                <div className="flex items-start gap-3 mt-2">
                  <div className="w-12 h-16 bg-white/30 rounded flex items-center justify-center text-[10px]">
                    Ảnh
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{member.fullName}</div>
                    <div className="text-xs opacity-80 mt-1">Mã: {member.memberCode}</div>
                    <div className="text-xs opacity-80 mt-0.5">Nhóm: {member.group}</div>
                    <div className="text-xs opacity-80 mt-0.5">
                      HSD: {new Date(member.cardExpiry).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  {showQR && (
                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                      <span className="text-[7px] text-gray-500 text-center leading-tight">QR</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-start print:hidden">
            <Button variant="outline" onClick={() => setStep(2)} className="cursor-pointer">
              <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
            </Button>
          </div>
        </div>
      )}

      {/* Print-only CSS */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:grid-cols-2, .print\\:grid-cols-2 * { visibility: visible; }
          .print\\:hidden { display: none !important; }
          nav, header, aside, footer, .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}
