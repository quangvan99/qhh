import { ClassResultsTable } from '@/features/lms/results/components/ClassResultsTable'

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, params is a Promise but we can use it directly in server component render
  return <ResultsPageClient paramsPromise={params} />
}

async function ResultsPageClient({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = await paramsPromise
  return <ClassResultsTable classId={id} />
}
