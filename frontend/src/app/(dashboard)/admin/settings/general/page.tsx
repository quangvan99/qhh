'use client'

import { SettingsTabs } from '@/features/admin/components/SettingsTabs'
import { GeneralSettingsForm } from '@/features/admin/components/GeneralSettingsForm'

export default function AdminSettingsGeneralPage() {
  return (
    <SettingsTabs>
      <GeneralSettingsForm />
    </SettingsTabs>
  )
}
