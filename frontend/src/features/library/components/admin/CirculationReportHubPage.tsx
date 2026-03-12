'use client'

import Link from 'next/link'
import { PageHeader } from '@/components/composite'
import { Card, CardContent } from '@/components/ui/card'
import {
  DoorOpen,
  Users,
  History,
  AlertTriangle,
  Lock,
  Trophy,
} from 'lucide-react'

interface ReportCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
}

const reportCards: ReportCard[] = [
  {
    title: 'Ra vào thư viện',
    description: 'Thống kê lượt ra vào thư viện theo ngày, giờ cao điểm',
    href: '/library/reports/entry-exit',
    icon: <DoorOpen className="h-8 w-8" />,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'Bạn đọc đang mượn',
    description: 'Danh sách bạn đọc đang mượn sách và trạng thái',
    href: '/library/reports/active-borrowers',
    icon: <Users className="h-8 w-8" />,
    color: 'text-green-600 bg-green-50',
  },
  {
    title: 'Lịch sử mượn trả',
    description: 'Tra cứu lịch sử mượn trả chi tiết theo bạn đọc, sách',
    href: '/library/reports/borrow-history',
    icon: <History className="h-8 w-8" />,
    color: 'text-purple-600 bg-purple-50',
  },
  {
    title: 'Bạn đọc quá hạn',
    description: 'Chi tiết bạn đọc quá hạn, tiền phạt ước tính',
    href: '/library/reports/overdue-borrowers',
    icon: <AlertTriangle className="h-8 w-8" />,
    color: 'text-red-600 bg-red-50',
  },
  {
    title: 'Sử dụng tủ đựng đồ',
    description: 'Tình trạng sử dụng tủ đựng đồ trong thư viện',
    href: '/library/reports/locker',
    icon: <Lock className="h-8 w-8" />,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    title: 'Top bạn đọc',
    description: 'Xếp hạng bạn đọc mượn nhiều nhất theo kỳ',
    href: '/library/reports/top-borrowers',
    icon: <Trophy className="h-8 w-8" />,
    color: 'text-yellow-600 bg-yellow-50',
  },
]

export function CirculationReportHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo lưu thông"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo' },
          { label: 'Lưu thông' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className={`rounded-xl p-4 ${card.color}`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
