'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppSelect } from '@/components/base/app-select'
import { toast } from 'sonner'

const unitTypeOptions = [
  { value: 'department', label: 'Phòng ban' },
  { value: 'faculty', label: 'Khoa' },
  { value: 'group', label: 'Tổ bộ môn' },
]

interface AddChildUnitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentName: string
}

export function AddChildUnitModal({ open, onOpenChange, parentName }: AddChildUnitModalProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [unitType, setUnitType] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    if (!name || !code || !unitType) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      toast.success(`Đã thêm đơn vị con "${name}"`)
      setName('')
      setCode('')
      setUnitType('')
      setEmail('')
      setPhone('')
      onOpenChange(false)
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm đơn vị con</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm">
            <span className="text-blue-600">Đơn vị cha: </span>
            <span className="font-medium text-blue-800">{parentName}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="childName">Tên đơn vị <span className="text-red-500">*</span></Label>
            <Input id="childName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên đơn vị" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="childCode">Mã đơn vị <span className="text-red-500">*</span></Label>
            <Input id="childCode" value={code} onChange={(e) => setCode(e.target.value)} placeholder="VD: TBM-001" />
          </div>

          <div className="space-y-2">
            <Label>Loại đơn vị <span className="text-red-500">*</span></Label>
            <AppSelect options={unitTypeOptions} value={unitType} onChange={setUnitType} placeholder="Chọn loại" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="childEmail">Email</Label>
            <Input id="childEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="childPhone">Điện thoại</Label>
            <Input id="childPhone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0234 xxx xxx" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Hủy</Button>
          <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
