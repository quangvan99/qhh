'use client'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger' | 'warning'
  loading?: boolean
}

export function ConfirmDialog({ open, onOpenChange, onConfirm, onCancel, title, description, confirmLabel = 'Xác nhận', cancelLabel = 'Hủy', variant = 'default', loading }: ConfirmDialogProps) {
  const confirmClass = variant === 'danger'
    ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
    : variant === 'warning'
    ? 'bg-amber-500 hover:bg-amber-600 text-white'
    : ''

  const handleCancel = () => {
    if (loading) return
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) onOpenChange(v) }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={loading} className="cursor-pointer">
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={cn('cursor-pointer min-w-[100px]', confirmClass)}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
