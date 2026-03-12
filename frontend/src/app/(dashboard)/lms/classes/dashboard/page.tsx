"use client"

import { ClassDashboard } from "@/features/lms/classes/components/ClassDashboard"
import { useClassDashboard } from "@/features/lms/classes/api/class.api"

export default function ClassDashboardPage() {
  const { data, isLoading } = useClassDashboard()
  return <ClassDashboard stats={data} loading={isLoading} />
}
