'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/patterns/data-table'
import { SearchBar } from '@/components/composite/search-bar'
import { AppBadge } from '@/components/base/app-badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface PickerQuestion {
  id: string
  content: string
  category: string
  difficulty: string
  type: string
}

const categories = ['Toán học', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh'] as const
const difficulties = ['Dễ', 'TB', 'Khó', 'Rất khó'] as const
const actions = ['Phân tích vai trò', 'Trình bày nguyên nhân', 'So sánh cấu trúc', 'Giải thích hiện tượng', 'Nêu đặc điểm'] as const

const mockPickerQuestions: PickerQuestion[] = Array.from({ length: 20 }, (_, i) => ({
  id: `pq-${i}`,
  content: `Câu hỏi ${i + 1}: ${actions[i % actions.length]!} trong ${categories[i % categories.length]!}`,
  category: categories[i % categories.length]!,
  difficulty: difficulties[i % difficulties.length]!,
  type: i < 15 ? 'Trắc nghiệm' : 'Tự luận',
}))

interface QuestionPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (questionIds: string[]) => void
  initialSelected?: string[]
}

export function QuestionPickerModal({ open, onOpenChange, onConfirm, initialSelected = [] }: QuestionPickerModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected))
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState('all')

  const filtered = mockPickerQuestions
    .filter((q) => !search || q.content.toLowerCase().includes(search.toLowerCase()))
    .filter((q) => category === 'all' || q.category === category)
    .filter((q) => difficulty === 'all' || q.difficulty === difficulty)

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const columns: ColumnDef<PickerQuestion, unknown>[] = [
    {
      id: 'select', header: '', size: 40,
      cell: ({ row }) => (
        <Checkbox
          checked={selected.has(row.original.id)}
          onCheckedChange={() => toggleSelect(row.original.id)}
        />
      ),
      enableSorting: false,
    },
    { accessorKey: 'content', header: 'Nội dung', cell: ({ row }) => <span className="text-sm truncate block max-w-sm">{row.original.content}</span> },
    { accessorKey: 'category', header: 'Danh mục' },
    {
      accessorKey: 'difficulty', header: 'Độ khó',
      cell: ({ row }) => {
        const d = row.original.difficulty
        const semantic = d === 'Dễ' ? 'success' : d === 'TB' ? 'info' : d === 'Khó' ? 'warning' : 'error'
        return <AppBadge semantic={semantic} size="sm">{d}</AppBadge>
      },
    },
    { accessorKey: 'type', header: 'Loại' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chọn câu hỏi đích danh</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 mb-2">
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm câu hỏi..." className="max-w-xs" />
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Toán học">Toán học</SelectItem>
              <SelectItem value="Vật lý">Vật lý</SelectItem>
              <SelectItem value="Hóa học">Hóa học</SelectItem>
              <SelectItem value="Ngữ văn">Ngữ văn</SelectItem>
              <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={(v) => v && setDifficulty(v)}>
            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Dễ">Dễ</SelectItem>
              <SelectItem value="TB">TB</SelectItem>
              <SelectItem value="Khó">Khó</SelectItem>
              <SelectItem value="Rất khó">Rất khó</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable data={filtered} columns={columns} pageSize={10} />

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            Đã chọn <strong>{selected.size}</strong> / {mockPickerQuestions.length} câu
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Hủy</Button>
            <Button onClick={() => { onConfirm(Array.from(selected)); onOpenChange(false) }} className="cursor-pointer">
              Xác nhận ({selected.size} câu)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
