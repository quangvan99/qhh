'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField } from '@/components/composite/form-field'
import { FileText, FileDown } from 'lucide-react'
import { toast } from 'sonner'

interface ExamExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  examName?: string
}

export function ExamExportModal({ open, onOpenChange, examName }: ExamExportModalProps) {
  const [format, setFormat] = useState<'word' | 'pdf'>('word')
  const [includeAnswers, setIncludeAnswers] = useState(false)
  const [includeExamCode, setIncludeExamCode] = useState(true)

  const handleExport = () => {
    toast.success('Đang xuất đề thi...', {
      description: `Xuất ${examName ?? 'đề thi'} định dạng ${format === 'word' ? 'Word (.docx)' : 'PDF'} ${includeAnswers ? 'có đáp án' : 'không đáp án'}`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xuất đề thi offline</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <FormField name="ex-format" label="Định dạng xuất">
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as 'word' | 'pdf')} className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="word" id="fmt-word" />
                <Label htmlFor="fmt-word" className="cursor-pointer flex items-center gap-1">
                  <FileText className="h-4 w-4" /> Word (.docx)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pdf" id="fmt-pdf" />
                <Label htmlFor="fmt-pdf" className="cursor-pointer flex items-center gap-1">
                  <FileDown className="h-4 w-4" /> PDF
                </Label>
              </div>
            </RadioGroup>
          </FormField>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Tùy chọn</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="ex-answers"
                checked={includeAnswers}
                onCheckedChange={(v) => setIncludeAnswers(!!v)}
              />
              <Label htmlFor="ex-answers" className="cursor-pointer text-sm">Kèm đáp án</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="ex-code"
                checked={includeExamCode}
                onCheckedChange={(v) => setIncludeExamCode(!!v)}
              />
              <Label htmlFor="ex-code" className="cursor-pointer text-sm">Có mã đề</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Hủy</Button>
          <Button onClick={handleExport} className="cursor-pointer">
            <FileDown className="h-4 w-4 mr-1" /> Xuất file
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
