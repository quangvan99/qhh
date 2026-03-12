'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Upload, Download, Trash2, Copy, Pencil } from 'lucide-react'
import { DataTable } from '@/components/patterns/data-table'
import { SearchBar } from '@/components/composite/search-bar'
import { AppBadge } from '@/components/base/app-badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfirmDialog } from '@/components/composite/confirm-dialog'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { toast } from 'sonner'
import type { Question, Difficulty } from '../types'

const difficultyLabels: Record<Difficulty, string> = { easy: 'Dễ', medium: 'TB', hard: 'Khó', very_hard: 'Rất khó' }
const difficultyVariants: Record<Difficulty, 'success' | 'info' | 'warning' | 'error'> = { easy: 'success', medium: 'info', hard: 'warning', very_hard: 'error' }

const mockQuestions: Question[] = Array.from({ length: 30 }, (_, i) => ({
  id: `q-${i}`, type: i < 20 ? 'single_choice' : 'essay',
  categoryId: `cat-${i % 5}`, categoryName: (['Toán học', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh'] as const)[i % 5] as string,
  difficulty: (['easy', 'medium', 'hard', 'very_hard'] as const)[i % 4] as Difficulty,
  content: `Câu hỏi ${i + 1}: Nội dung câu hỏi mẫu cho ngân hàng đề thi...`,
  options: i < 20 ? [
    { id: 'a', content: 'Đáp án A', isCorrect: i % 4 === 0, order: 0 },
    { id: 'b', content: 'Đáp án B', isCorrect: i % 4 === 1, order: 1 },
    { id: 'c', content: 'Đáp án C', isCorrect: i % 4 === 2, order: 2 },
    { id: 'd', content: 'Đáp án D', isCorrect: i % 4 === 3, order: 3 },
  ] : undefined,
  tags: ['tag1', 'tag2'], authorId: 'u-1', authorName: 'GV. Nguyễn Văn A',
  createdAt: '2026-03-01', updatedAt: '2026-03-10',
}))

export function QuestionBankPage() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [tab, setTab] = useState('mcq')
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)

  const handleClone = (question: Question) => {
    const cloned: Question = {
      ...question,
      id: `q-clone-${Date.now()}`,
      content: `[Bản sao] ${question.content}`,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    setQuestions((prev) => [cloned, ...prev])
    toast.success('Đã sao chép câu hỏi thành công')
  }

  const handleExport = () => {
    toast.success('Đang xuất file Excel...', { description: `Xuất ${filtered.length} câu hỏi ${tab === 'mcq' ? 'trắc nghiệm' : 'tự luận'}` })
  }

  const filtered = questions
    .filter((q) => tab === 'mcq' ? q.type !== 'essay' : q.type === 'essay')
    .filter((q) => !search || q.content.toLowerCase().includes(search.toLowerCase()))
    .filter((q) => difficulty === 'all' || q.difficulty === difficulty)

  const columns: ColumnDef<Question, unknown>[] = [
    { accessorKey: 'type', header: 'Loại', size: 80, cell: ({ row }) => <AppBadge semantic="info" size="sm">{row.original.type === 'essay' ? 'Tự luận' : 'TN'}</AppBadge> },
    { accessorKey: 'content', header: 'Nội dung', cell: ({ row }) => <span className="text-sm truncate block max-w-md">{row.original.content}</span> },
    { accessorKey: 'categoryName', header: 'Danh mục' },
    { accessorKey: 'difficulty', header: 'Độ khó', cell: ({ row }) => <AppBadge semantic={difficultyVariants[row.original.difficulty]} size="sm">{difficultyLabels[row.original.difficulty]}</AppBadge> },
    { accessorKey: 'authorName', header: 'Tác giả' },
    { accessorKey: 'createdAt', header: 'Ngày tạo' },
    {
      id: 'actions', header: '', size: 120,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link href={`/exam/question-bank/${row.original.type === 'essay' ? 'essay' : 'mcq'}/${row.original.id}/edit`}>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer"><Pencil className="h-3 w-3" /></Button>
          </Link>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={() => handleClone(row.original)} title="Sao chép"><Copy className="h-3 w-3" /></Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer text-destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="h-3 w-3" /></Button>
        </div>
      ),
      enableSorting: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Tree sidebar */}
      <Card className="lg:col-span-1">
        <CardContent className="p-4">
          <p className="font-semibold text-sm mb-3">Danh mục câu hỏi</p>
          <div className="space-y-1 text-sm">
            <button className="w-full text-left px-2 py-1.5 rounded hover:bg-muted cursor-pointer font-medium">Tất cả câu hỏi</button>
            {['Toán học', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh'].map((cat) => (
              <button key={cat} className="w-full text-left px-4 py-1.5 rounded hover:bg-muted cursor-pointer text-muted-foreground">{cat}</button>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-3 w-full cursor-pointer text-xs"><Plus className="h-3 w-3 mr-1" /> Thêm danh mục</Button>
        </CardContent>
      </Card>

      {/* Main content */}
      <div className="lg:col-span-3">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="mcq">Trắc nghiệm</TabsTrigger>
              <TabsTrigger value="essay">Tự luận</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Link href={`/exam/question-bank/${tab === 'essay' ? 'essay' : 'mcq'}/new`}>
                <Button size="sm" className="cursor-pointer"><Plus className="h-3 w-3 mr-1" /> Thêm câu hỏi</Button>
              </Link>
              <Link href={`/exam/question-bank/${tab === 'essay' ? 'essay' : 'mcq'}/import`}>
                <Button variant="outline" size="sm" className="cursor-pointer"><Upload className="h-3 w-3 mr-1" /> Import</Button>
              </Link>
              <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleExport}><Download className="h-3 w-3 mr-1" /> Xuất Excel</Button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Select value={difficulty} onValueChange={(v) => v && setDifficulty(v)}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">TB</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
                <SelectItem value="very_hard">Rất khó</SelectItem>
              </SelectContent>
            </Select>
            <SearchBar value={search} onChange={setSearch} placeholder="Tìm câu hỏi..." className="max-w-sm" />
          </div>

          <TabsContent value="mcq"><DataTable data={filtered} columns={columns} selectable pageSize={20} /></TabsContent>
          <TabsContent value="essay"><DataTable data={filtered} columns={columns} selectable pageSize={20} /></TabsContent>
        </Tabs>
      </div>

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => setDeleteOpen(false)} title="Xóa câu hỏi" description="Bạn có chắc muốn xóa câu hỏi này?" variant="danger" />
    </div>
  )
}
