'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface VideoConstraintsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: {
    deadline?: string
    minWatchPercent: number
    allowSeeking: boolean
    startDate?: string
    endDate?: string
    note?: string
  }) => void
}

export function VideoConstraintsModal({ open, onOpenChange, onSave }: VideoConstraintsModalProps) {
  const [deadline, setDeadline] = useState('')
  const [minWatchPercent, setMinWatchPercent] = useState(80)
  const [allowSeeking, setAllowSeeking] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [note, setNote] = useState('')

  const handleSave = () => {
    onSave({
      deadline: deadline || undefined,
      minWatchPercent,
      allowSeeking,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      note: note || undefined,
    })
    toast.success('Đã lưu ràng buộc video')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ràng buộc & lịch hiển thị Video</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline nộp bài</Label>
            <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>

          <div className="space-y-3">
            <Label htmlFor="minWatch">Phải xem tối thiểu (%)</Label>
            <Input id="minWatch" type="number" value={minWatchPercent} onChange={(e) => setMinWatchPercent(Number(e.target.value))} min={0} max={100} />
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={allowSeeking} onCheckedChange={(v) => setAllowSeeking(!!v)} id="allowSeeking" />
            <Label htmlFor="allowSeeking" className="cursor-pointer">Cho phép tua video</Label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="vStartDate">Ngày bắt đầu hiển thị</Label>
              <Input id="vStartDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vEndDate">Ngày kết thúc hiển thị</Label>
              <Input id="vEndDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú cho học sinh..." rows={3} />
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
