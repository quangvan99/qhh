import { BookForm } from '@/features/library/components/admin/BookForm'

interface EditBookPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params
  return <BookForm bookId={id} />
}
