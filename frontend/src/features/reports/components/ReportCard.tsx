'use client'

import { Users, Camera, GraduationCap, Library, Activity, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ReportMeta } from '../types'

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users className="h-6 w-6" />,
  Camera: <Camera className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  Library: <Library className="h-6 w-6" />,
  Activity: <Activity className="h-6 w-6" />,
}

interface ReportCardProps {
  meta: ReportMeta
  onSelect: () => void
  onExport: () => void
}

export function ReportCard({ meta, onSelect, onExport }: ReportCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-md"
      onClick={onSelect}
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className={meta.color}>
            {ICON_MAP[meta.icon]}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{meta.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onExport()
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </CardContent>
    </Card>
  )
}
