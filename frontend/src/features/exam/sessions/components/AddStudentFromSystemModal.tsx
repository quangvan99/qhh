'use client'

import { useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { AppAvatar } from '@/components/base/app-avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

// ── Types ──
interface SystemStudent {
  id: string
  name: string
  code: string
  className: string
  email: string
}

// ── Mock 15 students ──
const classNames = ['10A1', '10A2', '11A1', '11A2', '12A1', '12A2', '12A3']

const studentNames = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Thị Dung', 'Hoàng Văn Em',
  'Vũ Thị Phương', 'Đặng Minh Quang', 'Bùi Thị Hoa', 'Ngô Đức Hùng', 'Lý Thị Kim',
  'Trương Văn Long', 'Mai Thị Ngọc', 'Đinh Văn Phúc', 'Dương Thị Quỳnh', 'Hồ Văn Sơn',
]

const mockSystemStudents: SystemStudent[] = Array.from({ length: 15 }, (_, i) => ({
  id: `sys-${i}`,
  name: studentNames[i] ?? `Học sinh ${i + 1}`,
  code: `HS${String(i + 1).padStart(4, '0')}`,
  className: classNames[i % classNames.length] ?? '10A1',
  email: `student${i + 1}@school.edu.vn`,
}))

interface AddStudentFromSystemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd?: (studentIds: string[]) => void
}

export function AddStudentFromSystemModal({ open, onOpenChange, onAdd }: AddStudentFromSystemModalProps) {
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    return mockSystemStudents.filter((s) => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())
      const matchClass = classFilter === 'all' || s.className === classFilter
      return matchSearch && matchClass
    })
  }, [search, classFilter])

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (filtered.every((s) => selected.has(s.id))) {
      setSelected((prev) => {
        const next = new Set(prev)
        filtered.forEach((s) => next.delete(s.id))
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        filtered.forEach((s) => next.add(s.id))
        return next
      })
    }
  }

  const handleAdd = () => {
    const ids = Array.from(selected)
    onAdd?.(ids)
    toast.success(`Đã thêm ${ids.length} học sinh vào ca thi`)
    setSelected(new Set())
    onOpenChange(false)
  }

  const columns: ColumnDef<SystemStudent, unknown>[] = [
    {
      id: 'select', header: () => (
        <Checkbox
          checked={filtered.length > 0 && filtered.every((s) => selected.has(s.id))}
          onCheckedChange={toggleAll}
        />
      ),
      size: 40,
      cell: ({ row }) => (
        <Checkbox
          checked={selected.has(row.original.id)}
          onCheckedChange={() => toggleSelect(row.original.id)}
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'name', header: 'Học sinh',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AppAvatar name={row.original.name} size="xs" role="student" />
          <div>
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.code}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'className', header: 'Lớp' },
    { accessorKey: 'email', header: 'Email' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm học sinh từ hệ thống</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc mã HS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={classFilter} onValueChange={(v) => setClassFilter(v ?? 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Lớp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả lớp</SelectItem>
              {classNames.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable data={filtered} columns={columns} pageSize={10} />

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Đã chọn: <span className="font-semibold text-foreground">{selected.size}</span> học sinh
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Hủy</Button>
            <Button onClick={handleAdd} disabled={selected.size === 0} className="cursor-pointer">
              Thêm {selected.size > 0 ? `(${selected.size})` : ''}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
