export interface LibraryBook {
  id: string
  isbn: string
  title: string
  author: string
  publisher?: string
  publishYear?: number
  categoryId: string
  categoryName?: string
  locationId?: string
  locationName?: string
  description?: string
  coverUrl?: string
  totalCopies: number
  availableCopies: number
  status: 'available' | 'unavailable'
}

export interface BookCopy {
  id: string
  bookId: string
  copyCode: string
  condition: 'good' | 'fair' | 'poor' | 'lost'
  locationId?: string
  locationName?: string
  isAvailable: boolean
}

export interface LibraryMember {
  id: string
  userId?: string
  memberCode: string
  fullName: string
  email?: string
  memberType: 'student' | 'teacher' | 'staff'
  cardExpiry: string
  status: 'active' | 'suspended' | 'expired'
  currentBorrows: number
  maxBooks?: number
}

export interface BorrowRecord {
  id: string
  memberId: string
  memberName: string
  copyId: string
  copyCode?: string
  bookTitle: string
  borrowedAt: string
  dueDate: string
  returnedAt?: string
  status: 'borrowed' | 'returned' | 'overdue'
  fineAmount?: number
  finePaid?: boolean
}

export interface LibraryCategory {
  id: string
  name: string
  code?: string
  description?: string
  bookCount: number
}

export interface LibraryLocation {
  id: string
  name: string
  code?: string
  floor?: string
  description?: string
}

export interface BorrowRule {
  id: string
  memberType: string
  maxBooks: number
  loanDays: number
  finePerDay: number
  renewalAllowed: boolean
  maxRenewals: number
}

export interface NewsArticle {
  id: string
  title: string
  slug: string
  content: string
  coverUrl?: string
  publishedAt: string
  author?: string
  tags?: string[]
}

export interface LibraryStats {
  totalBooks: number
  availableBooks: number
  totalMembers: number
  borrowsThisMonth: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// === WF-09a1 Types ===

export interface LibraryEmailSettings {
  smtpServer: string
  smtpPort: number
  senderEmail: string
  ccOverdueEmail: string
  reminderFrequency: 'daily' | 'weekly' | 'biweekly'
}

export interface LibraryLanguageSettings {
  language: 'vi' | 'en'
  timezone: string
  dateFormat: string
  currency: string
  fineUnit: string
}

export interface ClassificationSystem {
  id: string
  code: string
  name: string
  description?: string
  isActive: boolean
}

export interface ActivityLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  objectType: string
  objectName: string
  ipAddress: string
  userAgent?: string
  dataBefore?: string
  dataAfter?: string
}

export interface PurchaseOrder {
  id: string
  title: string
  author: string
  publisher: string
  quantity: number
  estimatedPrice: number
  reason: string
  department: string
  requestedBy: string
  requestedAt: string
  status: 'pending' | 'approved' | 'rejected'
  reviewNote?: string
  reviewedBy?: string
  reviewedAt?: string
}

export interface WarehouseLog {
  id: string
  action: 'open' | 'close'
  performedBy: string
  performedAt: string
  note?: string
}

export interface InventorySession {
  id: string
  name: string
  startDate: string
  endDate: string
  scope: 'all' | 'category' | 'area'
  note?: string
  status: 'draft' | 'in_progress' | 'completed'
  totalItems: number
  scannedItems: number
}

export interface InventoryItem {
  id: string
  sessionId: string
  copyCode: string
  bookTitle: string
  location: string
  scanStatus: 'scanned' | 'not_scanned' | 'missing' | 'damaged'
  scannedAt?: string
}

export interface PendingShelvingItem {
  id: string
  copyCode: string
  bookTitle: string
  quantity: number
  supplier: string
  receivedAt: string
  shelfLocation?: string
}

export interface AccessionItem {
  id: string
  orderCode: string
  bookTitle: string
  orderedQuantity: number
  receivedQuantity: number
  condition: 'good' | 'damaged' | 'partial'
  accessionStatus: 'pending' | 'accepted' | 'rejected'
}

// === WF-09b Types ===

export interface PortalContent {
  id: string
  title: string
  type: 'introduction' | 'contact' | 'regulation' | 'schedule'
  content: string
  isActive: boolean
  displayOrder: number
  updatedAt: string
}

export interface PortalNewsItem {
  id: string
  title: string
  slug: string
  category: 'news' | 'event' | 'announcement'
  publishDate: string
  author: string
  summary: string
  content: string
  thumbnailUrl?: string
  status: 'draft' | 'published'
}

export interface EDocument {
  id: string
  title: string
  author: string
  publisher?: string
  publishYear: number
  category: string
  docType: 'PDF' | 'EPUB' | 'Video'
  coverUrl?: string
  pageCount?: number
  description?: string
  tags?: string[]
  isFree: boolean
  fileUrl?: string
  relatedDocs?: EDocument[]
}
