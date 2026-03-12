'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AppBadge } from '@/components/base/app-badge'
import { AppSelect } from '@/components/base/app-select'
import { SearchBar } from '@/components/composite/search-bar'
import { FileText, FileSpreadsheet, File, Check } from 'lucide-react'

interface FileLibItem {
  id: string
  name: string
  type: 'pdf' | 'word' | 'excel' | 'other'
  size: string
  uploadDate: string
}

const typeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-5 w-5 text-red-500" />,
  word: <FileText className="h-5 w-5 text-blue-500" />,
  excel: <FileSpreadsheet className="h-5 w-5 text-green-500" />,
  other: <File className="h-5 w-5 text-muted-foreground" />,
}

const typeBadgeMap: Record<string, { label: string; variant: 'error' | 'info' | 'success' | 'neutral' }> = {
  pdf: { label: 'PDF', variant: 'error' },
  word: { label: 'Word', variant: 'info' },
  excel: { label: 'Excel', variant: 'success' },
  other: { label: 'Khác', variant: 'neutral' },
}

const mockFiles: FileLibItem[] = [
  { id: '1', name: 'Giáo trình Toán cao cấp.pdf', type: 'pdf', size: '5.2 MB', uploadDate: '2026-02-01' },
  { id: '2', name: 'Bài tập chương 1.docx', type: 'word', size: '1.8 MB', uploadDate: '2026-02-05' },
  { id: '3', name: 'Danh sách điểm lớp 12A1.xlsx', type: 'excel', size: '0.5 MB', uploadDate: '2026-02-10' },
  { id: '4', name: 'Hướng dẫn thí nghiệm.pdf', type: 'pdf', size: '3.1 MB', uploadDate: '2026-02-12' },
  { id: '5', name: 'Đề cương ôn tập HK2.docx', type: 'word', size: '2.4 MB', uploadDate: '2026-02-15' },
  { id: '6', name: 'Bảng thống kê kết quả.xlsx', type: 'excel', size: '0.8 MB', uploadDate: '2026-02-18' },
  { id: '7', name: 'Tài liệu tham khảo CNTT.pdf', type: 'pdf', size: '8.7 MB', uploadDate: '2026-02-20' },
  { id: '8', name: 'Biên bản họp tổ bộ môn.docx', type: 'word', size: '0.3 MB', uploadDate: '2026-02-22' },
  { id: '9', name: 'Lịch thi cuối kỳ.xlsx', type: 'excel', size: '0.2 MB', uploadDate: '2026-03-01' },
  { id: '10', name: 'Slide bài giảng chương 5.pdf', type: 'pdf', size: '12.3 MB', uploadDate: '2026-03-05' },
]

const typeFilterOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'pdf', label: 'PDF' },
  { value: 'word', label: 'Word' },
  { value: 'excel', label: 'Excel' },
]

interface FilePickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (file: FileLibItem) => void
}

export function FilePickerModal({ open, onOpenChange, onSelect }: FilePickerModalProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = mockFiles.filter((f) => {
    if (typeFilter && f.type !== typeFilter) return false
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleConfirm = () => {
    const item = mockFiles.find((f) => f.id === selected)
    if (item) {
      onSelect(item)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn file từ thư viện</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm file..." className="flex-1" />
          <AppSelect options={typeFilterOptions} value={typeFilter} onChange={setTypeFilter} placeholder="Loại file" className="w-36" />
        </div>

        <div className="space-y-2 overflow-y-auto flex-1 min-h-0">
          {filtered.map((file) => {
            const badge = typeBadgeMap[file.type] ?? { label: 'Khác', variant: 'neutral' as const }
            return (
              <button
                key={file.id}
                type="button"
                onClick={() => setSelected(file.id)}
                className={`cursor-pointer w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                  selected === file.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'
                }`}
              >
                <div className="shrink-0">{typeIcons[file.type]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{new Date(file.uploadDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                <AppBadge semantic={badge.variant} size="sm">{badge.label}</AppBadge>
                {selected === file.id && <Check className="h-4 w-4 text-primary shrink-0" />}
              </button>
            )
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Hủy</Button>
          <Button onClick={handleConfirm} disabled={!selected} className="cursor-pointer">Chọn</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
