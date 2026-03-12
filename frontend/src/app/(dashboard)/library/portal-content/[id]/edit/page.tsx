import { PortalContentForm } from '@/features/library/components/admin/PortalContentForm'

interface EditPortalContentPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPortalContentPage({ params }: EditPortalContentPageProps) {
  const { id } = await params
  return <PortalContentForm contentId={id} />
}
