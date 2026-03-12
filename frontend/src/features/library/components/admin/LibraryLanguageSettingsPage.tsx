'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/composite'
import { AppInput, AppSelect } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import type { LibraryLanguageSettings } from '@/features/library/types/library.types'

const languageOptions = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
]

const timezoneOptions = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh (UTC+7)' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok (UTC+7)' },
  { value: 'UTC', label: 'UTC' },
]

const dateFormatOptions = [
  { value: 'dd/MM/yyyy', label: 'dd/MM/yyyy' },
  { value: 'MM/dd/yyyy', label: 'MM/dd/yyyy' },
  { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
]

const currencyOptions = [
  { value: 'VND', label: 'VND - Việt Nam Đồng' },
  { value: 'USD', label: 'USD - US Dollar' },
]

export function LibraryLanguageSettingsPage() {
  const [form, setForm] = useState<LibraryLanguageSettings>({
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'dd/MM/yyyy',
    currency: 'VND',
    fineUnit: 'VND/ngày',
  })

  const handleSave = () => {
    toast.success('Đã lưu cấu hình ngôn ngữ thư viện')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cấu hình ngôn ngữ thư viện"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Cài đặt' },
          { label: 'Ngôn ngữ' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Cài đặt hiển thị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppSelect
              label="Ngôn ngữ"
              options={languageOptions}
              value={form.language}
              onChange={(v) => setForm((p) => ({ ...p, language: v as 'vi' | 'en' }))}
            />
            <AppSelect
              label="Múi giờ"
              options={timezoneOptions}
              value={form.timezone}
              onChange={(v) => setForm((p) => ({ ...p, timezone: v }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AppSelect
              label="Định dạng ngày"
              options={dateFormatOptions}
              value={form.dateFormat}
              onChange={(v) => setForm((p) => ({ ...p, dateFormat: v }))}
            />
            <AppSelect
              label="Tiền tệ"
              options={currencyOptions}
              value={form.currency}
              onChange={(v) => setForm((p) => ({ ...p, currency: v }))}
            />
            <AppInput
              label="Đơn vị phạt"
              value={form.fineUnit}
              onChange={(e) => setForm((p) => ({ ...p, fineUnit: e.target.value }))}
              placeholder="VND/ngày"
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
