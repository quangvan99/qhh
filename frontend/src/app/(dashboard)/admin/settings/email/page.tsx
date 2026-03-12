'use client'

import { SettingsTabs } from '@/features/admin/components/SettingsTabs'
import { EmailSettingsForm } from '@/features/admin/components/EmailSettingsForm'

export default function AdminSettingsEmailPage() {
  return (
    <SettingsTabs>
      <EmailSettingsForm />
    </SettingsTabs>
  )
}
