import { BookDetail } from '@/features/library/components/admin/BookDetail'

interface BookDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params
  return <BookDetail bookId={id} />
}
