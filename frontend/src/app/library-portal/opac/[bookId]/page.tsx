import { BookDetailPortal } from '@/features/library/components/portal/BookDetailPortal'

interface BookDetailPageProps {
  params: Promise<{ bookId: string }>
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { bookId } = await params
  return <BookDetailPortal bookId={bookId} />
}
