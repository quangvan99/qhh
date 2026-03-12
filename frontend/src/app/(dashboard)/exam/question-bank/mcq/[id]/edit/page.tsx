import { MCQForm } from '@/features/exam/question-bank/components/MCQForm'

export default async function EditMCQPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <MCQForm questionId={id} />
}
