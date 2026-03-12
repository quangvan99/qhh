// ── LMS Discussion Types ──

export type DiscussionStatus = 'open' | 'closed'

export interface DiscussionThread {
  id: string
  classId: string
  title: string
  body: string
  authorId: string
  authorName: string
  authorAvatar?: string
  authorRole: 'teacher' | 'student'
  isPinned: boolean
  allowReplies: boolean
  status: DiscussionStatus
  replyCount: number
  viewCount: number
  attachments?: { id: string; name: string; url: string }[]
  createdAt: string
  updatedAt: string
}

export interface DiscussionPost {
  id: string
  threadId: string
  parentId?: string
  authorId: string
  authorName: string
  authorAvatar?: string
  authorRole: 'teacher' | 'student'
  content: string
  attachments?: { id: string; name: string; url: string }[]
  createdAt: string
  children?: DiscussionPost[]
}
