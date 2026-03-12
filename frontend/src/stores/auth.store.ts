import { create } from 'zustand'
import type { User, UserRole } from '@/types'

interface AuthState {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  hasPermission: (permission) => {
    const user = get().currentUser
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions?.includes(permission) ?? false
  },
  hasRole: (role) => {
    const user = get().currentUser
    if (!user) return false
    if (Array.isArray(role)) return role.includes(user.role)
    return user.role === role
  },
}))
