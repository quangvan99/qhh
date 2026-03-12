'use client'

import Link from 'next/link'
import { PageHeader } from '@/components/composite'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, CreditCard, Users } from 'lucide-react'

const reports = [
  {
    title: 'Thống kê tổng hợp',
    description: 'Tổng quan về số lượng bạn đọc, trạng thái thẻ và phân bổ theo nhóm.',
    icon: <BarChart3 className="h-8 w-8" />,
    href: '/library/reports/members/stats',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Thẻ mới cấp & sắp hết hạn',
    description: 'Danh sách thẻ mới cấp, sắp hết hạn và đã hết hạn để gia hạn kịp thời.',
    icon: <CreditCard className="h-8 w-8" />,
    href: '/library/reports/members/expiring',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Bạn đọc theo nhóm',
    description: 'Phân tích tình hình sử dụng thư viện theo từng nhóm bạn đọc.',
    icon: <Users className="h-8 w-8" />,
    href: '/library/reports/members/by-group',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
]

export function MemberReportHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo bạn đọc"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo' },
          { label: 'Bạn đọc' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.href} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col h-full">
              <div className={`w-14 h-14 rounded-lg ${report.bgColor} ${report.color} flex items-center justify-center mb-4`}>
                {report.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
              <p className="text-sm text-muted-foreground flex-1 mb-4">{report.description}</p>
              <Link href={report.href}>
                <Button variant="outline" className="cursor-pointer w-full">
                  Xem báo cáo
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
