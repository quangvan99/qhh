'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/composite/search-bar'
import { Video, Check } from 'lucide-react'

interface VideoLibItem {
  id: string
  name: string
  duration: string
  size: string
  uploadDate: string
}

const mockVideos: VideoLibItem[] = [
  { id: '1', name: 'Bài giảng Toán - Đạo hàm', duration: '45:20', size: '320 MB', uploadDate: '2026-02-10' },
  { id: '2', name: 'Bài giảng Lý - Động lực học', duration: '38:15', size: '280 MB', uploadDate: '2026-02-12' },
  { id: '3', name: 'Thí nghiệm Hóa - Phản ứng oxi hóa', duration: '22:30', size: '180 MB', uploadDate: '2026-02-15' },
  { id: '4', name: 'Tiếng Anh - Listening Practice Unit 5', duration: '30:00', size: '210 MB', uploadDate: '2026-02-20' },
  { id: '5', name: 'Hướng dẫn sử dụng phần mềm GeoGebra', duration: '15:45', size: '120 MB', uploadDate: '2026-03-01' },
  { id: '6', name: 'Lịch sử Việt Nam - Thời kỳ đổi mới', duration: '52:10', size: '380 MB', uploadDate: '2026-03-05' },
]

interface VideoPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (video: VideoLibItem) => void
}

export function VideoPickerModal({ open, onOpenChange, onSelect }: VideoPickerModalProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = mockVideos.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleConfirm = () => {
    const item = mockVideos.find((v) => v.id === selected)
    if (item) {
      onSelect(item)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn Video từ thư viện</DialogTitle>
        </DialogHeader>

        <SearchBar value={search} onChange={setSearch} placeholder="Tìm video..." className="mb-4" />

        <div className="space-y-2 overflow-y-auto flex-1 min-h-0">
          {filtered.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setSelected(video.id)}
              className={`cursor-pointer w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                selected === video.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'
              }`}
            >
              <div className="rounded-lg bg-muted p-2.5 shrink-0">
                <Video className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{video.name}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{video.duration}</span>
                  <span>•</span>
                  <span>{video.size}</span>
                  <span>•</span>
                  <span>{new Date(video.uploadDate).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              {selected === video.id && <Check className="h-4 w-4 text-primary shrink-0" />}
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
