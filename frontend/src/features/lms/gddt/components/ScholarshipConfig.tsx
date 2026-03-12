'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/composite/page-header'
import { ScholarshipLevelForm } from './ScholarshipLevelForm'
import { ScholarshipSessionForm } from './ScholarshipSessionForm'

export function ScholarshipConfig() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = searchParams.get('tab') ?? 'levels'

  const handleTabChange = (value: string) => {
    router.push(`/gddt/scholarship/levels?tab=${value}`)
  }

  return (
    <div>
      <PageHeader
        title="Cấu hình học bổng"
        breadcrumbs={[
          { label: 'GDĐT', href: '/gddt/classes' },
          { label: 'Học bổng' },
        ]}
      />

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="levels">Mức học bổng</TabsTrigger>
          <TabsTrigger value="sessions">Đợt xét tuyển</TabsTrigger>
        </TabsList>
        <TabsContent value="levels">
          <ScholarshipLevelForm />
        </TabsContent>
        <TabsContent value="sessions">
          <ScholarshipSessionForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
