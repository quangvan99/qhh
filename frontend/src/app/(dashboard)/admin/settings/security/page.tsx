'use client'

import { SettingsTabs } from '@/features/admin/components/SettingsTabs'
import { SecuritySettingsForm } from '@/features/admin/components/SecuritySettingsForm'

export default function AdminSettingsSecurityPage() {
  return (
    <SettingsTabs>
      <SecuritySettingsForm />
    </SettingsTabs>
  )
}
