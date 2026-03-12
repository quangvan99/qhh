'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

type CompletionType = 'viewed' | 'score' | 'time'

interface ScormCompletionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: {
    completionType: CompletionType
    minScore?: number
    minTime?: number
    startDate?: string
    endDate?: string
    allowReview: boolean
  }) => void
}

export function ScormCompletionModal({ open, onOpenChange, onSave }: ScormCompletionModalProps) {
  const [completionType, setCompletionType] = useState<CompletionType>('viewed')
  const [minScore, setMinScore] = useState('60')
  const [minTime, setMinTime] = useState('10')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [allowReview, setAllowReview] = useState(true)

  const handleSave = () => {
    onSave({
      completionType,
      minScore: completionType === 'score' ? Number(minScore) : undefined,
      minTime: completionType === 'time' ? Number(minTime) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      allowReview,
    })
    toast.success('Đã lưu điều kiện hoàn thành')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Điều kiện hoàn thành SCORM</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Completion Type */}
          <div className="space-y-3">
            <Label className="font-medium">Điều kiện hoàn thành</Label>
            <RadioGroup value={completionType} onValueChange={(v) => setCompletionType(v as CompletionType)}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="viewed" id="viewed" />
                <Label htmlFor="viewed" className="cursor-pointer">Xem xong</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="score" id="score" />
                <Label htmlFor="score" className="cursor-pointer">Đạt điểm tối thiểu</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="time" id="time" />
                <Label htmlFor="time" className="cursor-pointer">Xem đủ thời gian</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Conditional fields */}
          {completionType === 'score' && (
            <div className="space-y-2">
              <Label htmlFor="minScore">Điểm tối thiểu</Label>
              <Input id="minScore" type="number" value={minScore} onChange={(e) => setMinScore(e.target.value)} min="0" max="100" />
            </div>
          )}

          {completionType === 'time' && (
            <div className="space-y-2">
              <Label htmlFor="minTime">Thời gian tối thiểu (phút)</Label>
              <Input id="minTime" type="number" value={minTime} onChange={(e) => setMinTime(e.target.value)} min="1" />
            </div>
          )}

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Allow review */}
          <div className="flex items-center gap-3">
            <Switch checked={allowReview} onCheckedChange={(v) => setAllowReview(!!v)} id="allowReview" />
            <Label htmlFor="allowReview" className="cursor-pointer">Cho phép xem lại</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Hủy</Button>
          <Button onClick={handleSave} className="cursor-pointer">Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
