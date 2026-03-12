import { MemberForm } from '@/features/library/components/admin/MemberForm'

interface EditMemberPageProps {
  params: Promise<{ id: string }>
}

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const { id } = await params
  return <MemberForm memberId={id} />
}
