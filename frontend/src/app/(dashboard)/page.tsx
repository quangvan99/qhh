'use client'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { AdminDashboard } from '@/features/dashboard/components/AdminDashboard'
import { TeacherDashboard } from '@/features/dashboard/components/TeacherDashboard'
import { StudentDashboard } from '@/features/dashboard/components/StudentDashboard'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { role, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  switch (role) {
    case 'admin':
    case 'principal':
      return <AdminDashboard />
    case 'teacher':
      return <TeacherDashboard />
    case 'student':
      return <StudentDashboard />
    default:
      return <AdminDashboard />
  }
}
