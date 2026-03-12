'use client'

import { useState } from 'react'
import { FileSpreadsheet, FileText, FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { exportReport } from '@/lib/export'
import type { ExportFormat } from '../types'

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportTitle: string
  data?: Record<string, unknown>[]
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string; icon: React.ReactNode }[] = [
  { value: 'excel', label: 'Excel (.xlsx)', icon: <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> },
  { value: 'csv',   label: 'CSV (.csv)',    icon: <FileText        className="h-4 w-4 text-blue-600" /> },
  { value: 'pdf',   label: 'PDF (.pdf)',    icon: <FileDown        className="h-4 w-4 text-red-600" /> },
]

export function ExportModal({ open, onOpenChange, reportTitle, data }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('excel')
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const [includeSummary, setIncludeSummary] = useState(true)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!data?.length) {
      toast.error('Không có dữ liệu để xuất')
      return
    }

    setExporting(true)
    try {
      // Nhỏ delay để spinner hiển thị trước khi JS sync block
      await new Promise((r) => setTimeout(r, 120))

      const filename = `bao-cao-${reportTitle.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}`

      exportReport(data, {
        format,
        filename,
        title: `Báo cáo: ${reportTitle}`,
        includeHeaders,
        includeSummary,
      })

      toast.success(`Đã xuất báo cáo thành công!`)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      toast.error('Xuất báo cáo thất bại, vui lòng thử lại')
    } finally {
      setExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xuất báo cáo: {reportTitle}</DialogTitle>
          <DialogDescription>
            {data?.length
              ? `${data.length} bản ghi sẽ được xuất`
              : 'Chọn định dạng và tùy chọn xuất báo cáo'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Format selector */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Định dạng xuất</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              {FORMAT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={opt.value} />
                  {opt.icon}
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tùy chọn</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={includeHeaders}
                  onCheckedChange={(v) => setIncludeHeaders(!!v)}
                />
                <span className="text-sm">Bao gồm tiêu đề cột</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={includeSummary}
                  onCheckedChange={(v) => setIncludeSummary(!!v)}
                />
                <span className="text-sm">Bao gồm thống kê tổng hợp</span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={exporting}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button onClick={handleExport} disabled={exporting || !data?.length} className="cursor-pointer">
            {exporting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xuất...</>
            ) : (
              <><FileDown className="mr-2 h-4 w-4" />Xuất ngay</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
