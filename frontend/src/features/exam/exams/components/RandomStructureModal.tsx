'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField } from '@/components/composite/form-field'
import { AppBadge } from '@/components/base/app-badge'

interface RandomStructureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (config: { category: string; difficulty: string; questionType: string; count: number }) => void
}

export function RandomStructureModal({ open, onOpenChange, onApply }: RandomStructureModalProps) {
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [questionType, setQuestionType] = useState('all')
  const [count, setCount] = useState('20')

  const mockAvailable = 45

  const handleApply = () => {
    onApply({ category, difficulty, questionType, count: Number(count) })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cấu hình bộ lọc ngẫu nhiên</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <FormField name="r-category" label="Danh mục câu hỏi">
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="math">Toán học</SelectItem>
                <SelectItem value="physics">Vật lý</SelectItem>
                <SelectItem value="chemistry">Hóa học</SelectItem>
                <SelectItem value="literature">Ngữ văn</SelectItem>
                <SelectItem value="english">Tiếng Anh</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="r-difficulty" label="Độ khó">
            <Select value={difficulty} onValueChange={(v) => v && setDifficulty(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="r-type" label="Loại câu hỏi">
            <Select value={questionType} onValueChange={(v) => v && setQuestionType(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="mcq">Trắc nghiệm</SelectItem>
                <SelectItem value="essay">Tự luận</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="r-count" label="Số lượng câu cần lấy">
            <Input type="number" value={count} onChange={(e) => setCount(e.target.value)} min={1} max={mockAvailable} />
          </FormField>

          <div className="bg-muted/50 rounded-md p-3 text-sm">
            <AppBadge semantic="info" size="sm">Preview</AppBadge>
            <p className="mt-2 text-muted-foreground">
              Tìm thấy <strong className="text-foreground">{mockAvailable}</strong> câu phù hợp, sẽ lấy ngẫu nhiên <strong className="text-foreground">{count}</strong> câu
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Hủy</Button>
          <Button onClick={handleApply} className="cursor-pointer">Áp dụng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
