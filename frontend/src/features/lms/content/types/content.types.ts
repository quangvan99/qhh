// LMS Content Types

export interface ContentGroup {
  id: string
  classId: string
  name: string
  description?: string
  order: number
  visible: boolean
  itemCount: number
  items: ContentItem[]
}

export type ContentItemType = "scorm" | "video" | "text" | "file" | "survey" | "offline"

export interface ContentItem {
  id: string
  groupId: string
  type: ContentItemType
  title: string
  status: "draft" | "published" | "archived"
  order: number
  createdAt: string
}

export interface ScormItem extends ContentItem {
  type: "scorm"
  fileUrl: string
  fileSize: number
  launchUrl?: string
  completionType: "tracking" | "score" | "manual"
  minScore?: number
  maxAttempts?: number
}

export interface VideoItem extends ContentItem {
  type: "video"
  sourceType: "upload" | "embed"
  url: string
  duration?: number
  posterUrl?: string
  captionsUrl?: string
}

export interface TextItem extends ContentItem {
  type: "text"
  content: string // HTML from Tiptap
  attachments: FileAttachment[]
}

export interface FileItem extends ContentItem {
  type: "file"
  fileUrl: string
  fileName: string
  fileSize: number
  fileType: string
  description?: string
}

export interface SurveyItem extends ContentItem {
  type: "survey"
  anonymous: boolean
  showResults: boolean
  maxAttempts: number
  deadline?: string
  questions: SurveyQuestion[]
}

export type QuestionType = "radio" | "checkbox" | "text" | "scale" | "matrix"

export interface SurveyQuestion {
  id: string
  type: QuestionType
  content: string
  required: boolean
  order: number
  options?: SurveyOption[]
  maxLength?: number
  placeholder?: string
  scaleMin?: number
  scaleMax?: number
}

export interface SurveyOption {
  id: string
  label: string
  isCorrect?: boolean
}

export interface OfflineSessionItem extends ContentItem {
  type: "offline"
  date: string
  startTime: string
  endTime?: string
  location?: string
  description?: string
  expectedAttendees?: number
  attachments: FileAttachment[]
  sessionStatus: "upcoming" | "ongoing" | "completed"
}

export interface FileAttachment {
  id: string
  name: string
  url: string
  size: number
  type: string
}

export interface ScormLibraryItem {
  id: string
  name: string
  thumbnail?: string
  fileSize: number
  createdAt: string
  usageCount: number
}

export interface SurveyReport {
  surveyId: string
  totalResponses: number
  totalStudents: number
  completionRate: number
  questionReports: QuestionReport[]
}

export interface QuestionReport {
  questionId: string
  question: string
  type: QuestionType
  optionCounts?: { label: string; count: number }[]
  textResponses?: string[]
}
