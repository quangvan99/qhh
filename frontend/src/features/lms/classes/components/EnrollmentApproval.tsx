"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { AppButton } from "@/components/base/app-button"
import { AppAvatar } from "@/components/base/app-avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { ClassStudent } from "../types/class.types"

interface EnrollmentApprovalProps {
  pendingStudents: ClassStudent[]
  onApprove: (studentId: string) => void
  onReject: (studentId: string) => void
  onBulkApprove: (studentIds: string[]) => void
}

export function EnrollmentApproval({ pendingStudents, onApprove, onReject, onBulkApprove }: EnrollmentApprovalProps) {
  if (pendingStudents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Không có yêu cầu đăng ký nào đang chờ duyệt.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{pendingStudents.length} yêu cầu đang chờ</p>
        <AppButton module="lms" size="sm" onClick={() => onBulkApprove(pendingStudents.map((s) => s.studentId))}>
          Duyệt tất cả
        </AppButton>
      </div>
      <div className="space-y-2">
        {pendingStudents.map((student) => (
          <Card key={student.studentId}>
            <CardContent className="flex items-center gap-3 p-3">
              <AppAvatar name={student.name} src={student.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.code} • {student.email}</p>
              </div>
              <div className="flex items-center gap-1">
                <AppButton variant="ghost" size="sm" onClick={() => onApprove(student.studentId)} className="h-8 px-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />Duyệt
                </AppButton>
                <AppButton variant="ghost" size="sm" onClick={() => onReject(student.studentId)} className="h-8 px-2 text-destructive">
                  <XCircle className="h-4 w-4 mr-1" />Từ chối
                </AppButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
