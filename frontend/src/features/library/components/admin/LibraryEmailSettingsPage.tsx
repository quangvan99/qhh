'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/composite'
import { AppInput, AppSelect } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import type { LibraryEmailSettings } from '@/features/library/types/library.types'

const frequencyOptions = [
  { value: 'daily', label: 'Hàng ngày' },
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'biweekly', label: 'Hai tuần một lần' },
]

export function LibraryEmailSettingsPage() {
  const [form, setForm] = useState<LibraryEmailSettings>({
    smtpServer: 'smtp.qhlms.edu.vn',
    smtpPort: 587,
    senderEmail: 'library@qhlms.edu.vn',
    ccOverdueEmail: 'admin@qhlms.edu.vn',
    reminderFrequency: 'weekly',
  })

  const handleSave = () => {
    toast.success('Đã lưu cấu hình email thư viện')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cấu hình email thư viện"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Cài đặt' },
          { label: 'Email' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Cài đặt SMTP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppInput
              label="SMTP Server"
              required
              value={form.smtpServer}
              onChange={(e) => setForm((p) => ({ ...p, smtpServer: e.target.value }))}
              placeholder="smtp.example.com"
            />
            <AppInput
              label="Port"
              type="number"
              required
              value={String(form.smtpPort)}
              onChange={(e) => setForm((p) => ({ ...p, smtpPort: Number(e.target.value) }))}
              placeholder="587"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppInput
              label="Email gửi"
              required
              value={form.senderEmail}
              onChange={(e) => setForm((p) => ({ ...p, senderEmail: e.target.value }))}
              placeholder="library@example.com"
            />
            <AppInput
              label="Email CC thông báo quá hạn"
              value={form.ccOverdueEmail}
              onChange={(e) => setForm((p) => ({ ...p, ccOverdueEmail: e.target.value }))}
              placeholder="admin@example.com"
            />
          </div>
          <div className="max-w-xs">
            <AppSelect
              label="Tần suất nhắc nhở"
              options={frequencyOptions}
              value={form.reminderFrequency}
              onChange={(v) => setForm((p) => ({ ...p, reminderFrequency: v as LibraryEmailSettings['reminderFrequency'] }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="cursor-pointer">
          Lưu cấu hình
        </Button>
      </div>
    </div>
  )
}
