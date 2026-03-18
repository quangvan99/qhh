import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ClassStore {
  currentClassId: string | null
  setCurrentClass: (id: string) => void
  clearCurrentClass: () => void
}

export const useClassStore = create<ClassStore>()(
  persist(
    (set) => ({
      currentClassId: null,
      setCurrentClass: (id) => set({ currentClassId: id }),
      clearCurrentClass: () => set({ currentClassId: null }),
    }),
    { name: 'qh-current-class' }
  )
)
