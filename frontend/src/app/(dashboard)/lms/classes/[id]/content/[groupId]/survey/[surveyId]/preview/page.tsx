'use client'

import { use } from 'react'
import { SurveyPreviewPage } from '@/features/lms/content/components/SurveyPreviewPage'

export default function SurveyPreviewRoute({ params }: { params: Promise<{ id: string; groupId: string; surveyId: string }> }) {
  const { id, groupId, surveyId } = use(params)
  return <SurveyPreviewPage classId={id} groupId={groupId} surveyId={surveyId} />
}
