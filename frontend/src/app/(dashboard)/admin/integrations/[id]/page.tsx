'use client'

import { use } from 'react'
import { IntegrationConfig } from '@/features/admin/components/IntegrationConfig'

export default function AdminIntegrationConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <IntegrationConfig integrationId={id} />
}
