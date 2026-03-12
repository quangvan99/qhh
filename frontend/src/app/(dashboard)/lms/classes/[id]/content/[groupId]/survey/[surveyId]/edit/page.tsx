'use client'

import { use } from 'react'
import { SurveyEditForm } from '@/features/lms/content/components/SurveyEditForm'

export default function SurveyEditPage({ params }: { params: Promise<{ id: string; groupId: string; surveyId: string }> }) {
  const { id, groupId, surveyId } = use(params)
  return <SurveyEditForm classId={id} groupId={groupId} surveyId={surveyId} />
}
