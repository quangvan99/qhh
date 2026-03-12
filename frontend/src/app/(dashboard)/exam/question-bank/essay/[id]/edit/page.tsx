import { EssayForm } from '@/features/exam/question-bank/components/EssayForm'

export default async function EditEssayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EssayForm questionId={id} />
}
