"use client"

import { StatGrid } from "@/components/patterns/stat-grid"
import { ChartCard } from "@/components/patterns/chart-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle2, BarChart3 } from "lucide-react"
import type { SurveyReport as SurveyReportType } from "../types/content.types"

interface SurveyReportProps {
  report?: SurveyReportType
  loading?: boolean
}

export function SurveyReport({ report, loading }: SurveyReportProps) {
  return (
    <div className="space-y-6">
      <StatGrid
        cols={3}
        stats={[
          { title: "Đã làm", value: report?.totalResponses ?? 0, icon: <CheckCircle2 className="h-5 w-5" />, module: "lms", loading },
          { title: "Chưa làm", value: (report?.totalStudents ?? 0) - (report?.totalResponses ?? 0), icon: <Users className="h-5 w-5" />, module: "lms", loading },
          { title: "Hoàn thành", value: `${report?.completionRate ?? 0}%`, icon: <BarChart3 className="h-5 w-5" />, module: "lms", loading },
        ]}
      />

      {report?.questionReports?.map((qr, idx) => (
        <Card key={qr.questionId}>
          <CardHeader>
            <CardTitle className="text-sm">Câu {idx + 1}: {qr.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {qr.optionCounts ? (
              <ChartCard
                title=""
                type="pie"
                data={qr.optionCounts.map((o) => ({ name: o.label, value: o.count }))}
                dataKey="value"
                height={200}
              />
            ) : qr.textResponses ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {qr.textResponses.map((text, i) => (
                  <div key={i} className="text-sm p-2 bg-muted/30 rounded">{text}</div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
