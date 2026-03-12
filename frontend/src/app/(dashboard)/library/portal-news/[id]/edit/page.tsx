import { PortalNewsForm } from '@/features/library/components/admin/PortalNewsForm'

interface EditPortalNewsPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPortalNewsPage({ params }: EditPortalNewsPageProps) {
  const { id } = await params
  return <PortalNewsForm newsId={id} />
}
