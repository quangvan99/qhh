'use client'

import { useParams } from 'next/navigation'
import { ConductScoreForm } from '@/features/lms/gddt/components/ConductScoreForm'

export default function EditConductCriteriaPage() {
  const params = useParams()
  const id = params.id as string
  return <ConductScoreForm editId={id} />
}
