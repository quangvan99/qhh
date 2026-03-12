'use client'

import { use } from 'react'
import { SurveyReportPage } from '@/features/lms/content/components/SurveyReportPage'

export default function SurveyReportRoute({ params }: { params: Promise<{ id: string; groupId: string; surveyId: string }> }) {
  const { id, groupId, surveyId } = use(params)
  return <SurveyReportPage classId={id} groupId={groupId} surveyId={surveyId} />
}
