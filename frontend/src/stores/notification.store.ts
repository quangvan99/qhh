import { create } from 'zustand'

interface Notification {
  id: string
  title: string
  body: string
  type: string
  read: boolean
  createdAt: string
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (n: Notification[]) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter(n => !n.read).length }),
  markAsRead: (id) => {
    const notifications = get().notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
    set({ notifications, unreadCount: notifications.filter(n => !n.read).length })
  },
  markAllAsRead: () => {
    const notifications = get().notifications.map(n => ({ ...n, read: true }))
    set({ notifications, unreadCount: 0 })
  },
}))
