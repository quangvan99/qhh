import { MemberGroupForm } from '@/features/library/components/admin/MemberGroupForm'

export default async function EditMemberGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <MemberGroupForm groupId={id} />
}
