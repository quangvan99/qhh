import { NewsDetail } from '@/features/library/components/portal/NewsDetail'

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params
  return <NewsDetail slug={slug} />
}
