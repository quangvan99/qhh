'use client'

import { use } from 'react'
import { FaceProfileForm } from '@/features/ai-attendance/components/FaceProfileForm'
import { useGetFaceProfiles } from '@/features/ai-attendance/api/attendance.api'

export default function EditFacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: profiles = [] } = useGetFaceProfiles()
  const profile = profiles.find(p => p.id === id)

  if (!profile) {
    return <div className="p-8 text-muted-foreground">Đang tải...</div>
  }

  return <FaceProfileForm profile={profile} />
}
