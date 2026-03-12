'use client'

import { use } from 'react'
import { LmsUserForm } from '@/features/lms/components/LmsUserForm'

export default function LmsUserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <LmsUserForm userId={id} />
}
