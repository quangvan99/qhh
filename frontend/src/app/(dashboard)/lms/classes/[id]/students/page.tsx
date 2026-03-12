"use client"

import { use, useState } from "react"
import { PageHeader } from "@/components/composite/page-header"
import { StudentList } from "@/features/lms/classes/components/StudentList"
import { AddStudentModal } from "@/features/lms/classes/components/AddStudentModal"
import { useGetClassStudents, useAddStudents, useRemoveStudent, useApproveEnrollment, useBulkApproveEnrollment, useSearchStudents } from "@/features/lms/classes/api/class.api"
import { toast } from "sonner"

export default function StudentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [showAdd, setShowAdd] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { data, isLoading } = useGetClassStudents(id)
  const { data: searchResults } = useSearchStudents(searchQuery)
  const addMutation = useAddStudents(id)
  const removeMutation = useRemoveStudent(id)
  const approveMutation = useApproveEnrollment(id)
  const bulkApproveMutation = useBulkApproveEnrollment(id)

  const students = data?.data ?? []
  const pendingCount = students.filter((s) => s.status === "pending").length

  return (
    <div>
      <PageHeader
        title="Học sinh"
        breadcrumbs={[{ label: "LMS", href: "/lms" }, { label: "Lớp học", href: "/lms/classes" }, { label: "Học sinh" }]}
      />

      <StudentList
        students={students}
        pendingCount={pendingCount}
        loading={isLoading}
        onApprove={(sid) => approveMutation.mutate(sid, { onSuccess: () => toast.success("Đã duyệt") })}
        onBulkApprove={(sids) => bulkApproveMutation.mutate(sids, { onSuccess: () => toast.success("Đã duyệt tất cả") })}
        onRemove={(sid) => removeMutation.mutate(sid, { onSuccess: () => toast.success("Đã xóa") })}
        onAddClick={() => setShowAdd(true)}
      />

      <AddStudentModal
        open={showAdd}
        onOpenChange={setShowAdd}
        students={searchResults?.data ?? []}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onConfirm={(ids) => addMutation.mutate(ids, { onSuccess: () => { toast.success("Đã thêm học sinh"); setShowAdd(false) } })}
        confirming={addMutation.isPending}
      />
    </div>
  )
}
