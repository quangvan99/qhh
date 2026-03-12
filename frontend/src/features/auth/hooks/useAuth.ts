'use client'

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react'
import type { UserRole } from '@/types'

export function useAuth() {
  const { data: session, status } = useSession()

  const user = session?.user
  const role = user?.role as UserRole | undefined

  return {
    user,
    role,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isAdmin: role === 'admin',
    isPrincipal: role === 'principal',
    isTeacher: role === 'teacher',
    isStudent: role === 'student',
    hasRole: (roles: UserRole[]) => !!role && roles.includes(role),
    signOut: () => nextAuthSignOut({ callbackUrl: '/login' }),
  }
}
