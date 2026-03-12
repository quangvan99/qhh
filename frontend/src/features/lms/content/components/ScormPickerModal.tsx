'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppSelect } from '@/components/base/app-select'
import { AppBadge } from '@/components/base/app-badge'
import { SearchBar } from '@/components/composite/search-bar'
import { Package, Check } from 'lucide-react'

interface ScormLibItem {
  id: string
  name: string
  size: string
  uploadDate: string
  duration: string
}

const mockScorms: ScormLibItem[] = [
  { id: '1', name: 'Bài 1: Giới thiệu lập trình', size: '12.5 MB', uploadDate: '2026-02-15', duration: '25 phút' },
  { id: '2', name: 'Bài 2: Biến và kiểu dữ liệu', size: '15.2 MB', uploadDate: '2026-02-18', duration: '30 phút' },
  { id: '3', name: 'Bài 3: Cấu trúc điều khiển', size: '18.0 MB', uploadDate: '2026-02-20', duration: '35 phút' },
  { id: '4', name: 'Bài 4: Vòng lặp', size: '14.8 MB', uploadDate: '2026-02-22', duration: '28 phút' },
  { id: '5', name: 'An toàn giao thông - Module 1', size: '22.3 MB', uploadDate: '2026-01-10', duration: '40 phút' },
  { id: '6', name: 'An toàn giao thông - Module 2', size: '19.7 MB', uploadDate: '2026-01-12', duration: '35 phút' },
  { id: '7', name: 'Tiếng Anh giao tiếp - Unit 1', size: '25.1 MB', uploadDate: '2026-03-01', duration: '45 phút' },
  { id: '8', name: 'Tiếng Anh giao tiếp - Unit 2', size: '23.8 MB', uploadDate: '2026-03-05', duration: '42 phút' },
]

const categoryOptions = [
  { value: '', label: 'Tất cả danh mục' },
  { value: 'programming', label: 'Lập trình' },
  { value: 'safety', label: 'An toàn' },
  { value: 'english', label: 'Tiếng Anh' },
]

interface ScormPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (scorm: ScormLibItem) => void
}

export function ScormPickerModal({ open, onOpenChange, onSelect }: ScormPickerModalProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = mockScorms.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleConfirm = () => {
    const item = mockScorms.find((s) => s.id === selected)
    if (item) {
      onSelect(item)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn SCORM từ thư viện</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm SCORM..." className="flex-1" />
          <AppSelect options={categoryOptions} value={category} onChange={setCategory} placeholder="Danh mục" className="w-44" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto flex-1 min-h-0">
          {filtered.map((scorm) => (
            <button
              key={scorm.id}
              type="button"
              onClick={() => setSelected(scorm.id)}
              className={`cursor-pointer flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                selected === scorm.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'
              }`}
            >
              <div className="rounded-lg bg-muted p-2.5 shrink-0">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{scorm.name}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{scorm.size}</span>
                  <span>•</span>
                  <span>{scorm.duration}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(scorm.uploadDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              {selected === scorm.id && (
                <Check className="h-4 w-4 text-primary shrink-0 mt-1" />
              )}
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Hủy</Button>
          <Button onClick={handleConfirm} disabled={!selected} className="cursor-pointer">Chọn</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
