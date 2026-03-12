'use client'
import { useState } from 'react'
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue }
    catch { return initialValue }
  })
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const toStore = value instanceof Function ? value(stored) : value
      setStored(toStore)
      if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(toStore))
    } catch { /* ignore */ }
  }
  return [stored, setValue] as const
}
