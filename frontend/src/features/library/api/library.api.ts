import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type {
  LibraryBook,
  BookCopy,
  LibraryMember,
  BorrowRecord,
  LibraryCategory,
  LibraryLocation,
  BorrowRule,
  NewsArticle,
  LibraryStats,
  PaginatedResponse,
  PortalContent,
  PortalNewsItem,
  EDocument,
} from '../types/library.types'

// ─── Categories ─────────────────────────────────────────────────

export function useGetCategories() {
  return useQuery({
    queryKey: ['library-categories'],
    queryFn: () => apiFetch<LibraryCategory[]>('/api/library/categories'),
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<LibraryCategory, 'id' | 'bookCount'>) =>
      apiFetch<LibraryCategory>('/api/library/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-categories'] }) },
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: LibraryCategory) =>
      apiFetch<LibraryCategory>(`/api/library/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-categories'] }) },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-categories'] }) },
  })
}

// ─── Locations ──────────────────────────────────────────────────

export function useGetLocations() {
  return useQuery({
    queryKey: ['library-locations'],
    queryFn: () => apiFetch<LibraryLocation[]>('/api/library/locations'),
  })
}

export function useCreateLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<LibraryLocation, 'id'>) =>
      apiFetch<LibraryLocation>('/api/library/locations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-locations'] }) },
  })
}

export function useUpdateLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: LibraryLocation) =>
      apiFetch<LibraryLocation>(`/api/library/locations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-locations'] }) },
  })
}

export function useDeleteLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/locations/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-locations'] }) },
  })
}

// ─── Borrow Rules ───────────────────────────────────────────────

export function useGetBorrowRules() {
  return useQuery({
    queryKey: ['library-borrow-rules'],
    queryFn: () => apiFetch<BorrowRule[]>('/api/library/borrow-rules'),
  })
}

export function useCreateBorrowRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<BorrowRule, 'id'>) =>
      apiFetch<BorrowRule>('/api/library/borrow-rules', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-borrow-rules'] }) },
  })
}

export function useUpdateBorrowRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: BorrowRule) =>
      apiFetch<BorrowRule>(`/api/library/borrow-rules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-borrow-rules'] }) },
  })
}

export function useDeleteBorrowRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/borrow-rules/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-borrow-rules'] }) },
  })
}

// ─── Books ──────────────────────────────────────────────────────

export function useGetBooks(params: {
  search?: string
  categoryId?: string
  locationId?: string
  status?: string
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['library-books', params],
    queryFn: () => {
      const sp = new URLSearchParams()
      if (params.search) sp.set('search', params.search)
      if (params.categoryId) sp.set('categoryId', params.categoryId)
      if (params.locationId) sp.set('locationId', params.locationId)
      if (params.status) sp.set('status', params.status)
      if (params.page) sp.set('page', String(params.page))
      if (params.pageSize) sp.set('pageSize', String(params.pageSize))
      return apiFetch<PaginatedResponse<LibraryBook>>(`/api/library/books?${sp.toString()}`)
    },
  })
}

export function useGetBook(id: string) {
  return useQuery({
    queryKey: ['library-book', id],
    queryFn: () => apiFetch<LibraryBook>(`/api/library/books/${id}`),
    enabled: !!id,
  })
}

export function useCreateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<LibraryBook, 'id' | 'totalCopies' | 'availableCopies' | 'status' | 'categoryName' | 'locationName'>) =>
      apiFetch<LibraryBook>('/api/library/books', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-books'] }) },
  })
}

export function useUpdateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: LibraryBook) =>
      apiFetch<LibraryBook>(`/api/library/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-books'] })
      void qc.invalidateQueries({ queryKey: ['library-book'] })
    },
  })
}

export function useDeleteBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/books/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-books'] }) },
  })
}

export function useImportBooks() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return apiFetch<{ imported: number; errors: { row: number; message: string }[] }>(
        '/api/library/books/import',
        { method: 'POST', body: fd, headers: {} }
      )
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-books'] }) },
  })
}

// ─── Copies ─────────────────────────────────────────────────────

export function useGetBookCopies(bookId: string) {
  return useQuery({
    queryKey: ['library-copies', bookId],
    queryFn: () => apiFetch<BookCopy[]>(`/api/library/books/${bookId}/copies`),
    enabled: !!bookId,
  })
}

export function useCreateCopy() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { bookId: string; copyCode: string; condition: string; locationId?: string }) =>
      apiFetch<BookCopy>(`/api/library/books/${data.bookId}/copies`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-copies'] })
      void qc.invalidateQueries({ queryKey: ['library-books'] })
    },
  })
}

export function useUpdateCopy() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, bookId, ...data }: BookCopy) =>
      apiFetch<BookCopy>(`/api/library/copies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-copies'] })
      void qc.invalidateQueries({ queryKey: ['library-books'] })
    },
  })
}

export function useDeleteCopy() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/copies/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-copies'] })
      void qc.invalidateQueries({ queryKey: ['library-books'] })
    },
  })
}

// ─── Members ────────────────────────────────────────────────────

export function useGetMembers(params: {
  search?: string
  memberType?: string
  status?: string
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['library-members', params],
    queryFn: () => {
      const sp = new URLSearchParams()
      if (params.search) sp.set('search', params.search)
      if (params.memberType) sp.set('memberType', params.memberType)
      if (params.status) sp.set('status', params.status)
      if (params.page) sp.set('page', String(params.page))
      if (params.pageSize) sp.set('pageSize', String(params.pageSize))
      return apiFetch<PaginatedResponse<LibraryMember>>(`/api/library/members?${sp.toString()}`)
    },
  })
}

export function useGetMember(id: string) {
  return useQuery({
    queryKey: ['library-member', id],
    queryFn: () => apiFetch<LibraryMember>(`/api/library/members/${id}`),
    enabled: !!id,
  })
}

export function useCreateMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<LibraryMember, 'id' | 'currentBorrows'>) =>
      apiFetch<LibraryMember>('/api/library/members', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-members'] }) },
  })
}

export function useUpdateMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: LibraryMember) =>
      apiFetch<LibraryMember>(`/api/library/members/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-members'] })
      void qc.invalidateQueries({ queryKey: ['library-member'] })
    },
  })
}

export function useDeleteMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/members/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['library-members'] }) },
  })
}

// ─── Borrow / Circulation ───────────────────────────────────────

export function useGetBorrows(params: {
  status?: string
  memberId?: string
  overdue?: boolean
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['library-borrows', params],
    queryFn: () => {
      const sp = new URLSearchParams()
      if (params.status) sp.set('status', params.status)
      if (params.memberId) sp.set('memberId', params.memberId)
      if (params.overdue) sp.set('overdue', 'true')
      if (params.page) sp.set('page', String(params.page))
      if (params.pageSize) sp.set('pageSize', String(params.pageSize))
      return apiFetch<PaginatedResponse<BorrowRecord>>(`/api/library/borrows?${sp.toString()}`)
    },
  })
}

export function useCreateBorrow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { memberId: string; copyId: string; dueDate?: string }) =>
      apiFetch<BorrowRecord>('/api/library/borrows', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-borrows'] })
      void qc.invalidateQueries({ queryKey: ['library-members'] })
      void qc.invalidateQueries({ queryKey: ['library-copies'] })
    },
  })
}

export function useReturnBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { copyId: string; condition?: string; note?: string; finePaid?: boolean }) =>
      apiFetch<BorrowRecord>('/api/library/borrows/return', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['library-borrows'] })
      void qc.invalidateQueries({ queryKey: ['library-members'] })
      void qc.invalidateQueries({ queryKey: ['library-copies'] })
    },
  })
}

// ─── OPAC (Public) ──────────────────────────────────────────────

export function useSearchOPAC(params: {
  q?: string
  categoryId?: string
  author?: string
  yearFrom?: number
  yearTo?: number
  available?: boolean
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['opac-search', params],
    queryFn: () => {
      const sp = new URLSearchParams()
      if (params.q) sp.set('q', params.q)
      if (params.categoryId) sp.set('categoryId', params.categoryId)
      if (params.author) sp.set('author', params.author)
      if (params.yearFrom) sp.set('yearFrom', String(params.yearFrom))
      if (params.yearTo) sp.set('yearTo', String(params.yearTo))
      if (params.available) sp.set('available', 'true')
      if (params.page) sp.set('page', String(params.page))
      if (params.pageSize) sp.set('pageSize', String(params.pageSize))
      return apiFetch<PaginatedResponse<LibraryBook>>(`/api/library/opac/search?${sp.toString()}`)
    },
  })
}

export function useGetBookDetail(bookId: string) {
  return useQuery({
    queryKey: ['opac-book', bookId],
    queryFn: () => apiFetch<LibraryBook & { copies: BookCopy[] }>(`/api/library/opac/books/${bookId}`),
    enabled: !!bookId,
  })
}

// ─── News ───────────────────────────────────────────────────────

export function useGetNews(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['library-news', params],
    queryFn: () => {
      const sp = new URLSearchParams()
      if (params?.page) sp.set('page', String(params.page))
      if (params?.pageSize) sp.set('pageSize', String(params.pageSize))
      return apiFetch<PaginatedResponse<NewsArticle>>(`/api/library/news?${sp.toString()}`)
    },
  })
}

export function useGetNewsArticle(slug: string) {
  return useQuery({
    queryKey: ['library-news', slug],
    queryFn: () => apiFetch<NewsArticle>(`/api/library/news/${slug}`),
    enabled: !!slug,
  })
}

// ─── Library Stats ──────────────────────────────────────────────

export function useGetLibraryStats() {
  return useQuery({
    queryKey: ['library-stats'],
    queryFn: () => apiFetch<LibraryStats>('/api/library/stats'),
  })
}

// ─── Portal Content (Admin CMS) ─────────────────────────────────

export function useGetPortalContents() {
  return useQuery({
    queryKey: ['portal-contents'],
    queryFn: () => apiFetch<PortalContent[]>('/api/library/portal-content'),
  })
}

export function useGetPortalContent(id: string) {
  return useQuery({
    queryKey: ['portal-content', id],
    queryFn: () => apiFetch<PortalContent>(`/api/library/portal-content/${id}`),
    enabled: !!id,
  })
}

export function useCreatePortalContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<PortalContent, 'id' | 'updatedAt'>) =>
      apiFetch<PortalContent>('/api/library/portal-content', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['portal-contents'] }) },
  })
}

export function useUpdatePortalContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: PortalContent) =>
      apiFetch<PortalContent>(`/api/library/portal-content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['portal-contents'] })
      void qc.invalidateQueries({ queryKey: ['portal-content'] })
    },
  })
}

export function useDeletePortalContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/portal-content/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['portal-contents'] }) },
  })
}

// ─── Portal News (Admin CMS) ────────────────────────────────────

export function useGetPortalNews(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['portal-news', params],
    queryFn: () => {
      const sp = new URLSearchParams()
      if (params?.page) sp.set('page', String(params.page))
      if (params?.pageSize) sp.set('pageSize', String(params.pageSize))
      return apiFetch<PaginatedResponse<PortalNewsItem>>(`/api/library/portal-news?${sp.toString()}`)
    },
  })
}

export function useGetPortalNewsItem(id: string) {
  return useQuery({
    queryKey: ['portal-news-item', id],
    queryFn: () => apiFetch<PortalNewsItem>(`/api/library/portal-news/${id}`),
    enabled: !!id,
  })
}

export function useCreatePortalNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<PortalNewsItem, 'id'>) =>
      apiFetch<PortalNewsItem>('/api/library/portal-news', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['portal-news'] }) },
  })
}

export function useUpdatePortalNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: PortalNewsItem) =>
      apiFetch<PortalNewsItem>(`/api/library/portal-news/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['portal-news'] })
      void qc.invalidateQueries({ queryKey: ['portal-news-item'] })
    },
  })
}

export function useDeletePortalNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/library/portal-news/${id}`, { method: 'DELETE' }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['portal-news'] }) },
  })
}

// ─── E-Documents (Portal) ───────────────────────────────────────

export function useGetEDocuments(params?: {
  search?: string
  category?: string
  year?: number
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['edocuments', params],
    queryFn: () => {
      const sp = new URLSearchParams()
      if (params?.search) sp.set('search', params.search)
      if (params?.category) sp.set('category', params.category)
      if (params?.year) sp.set('year', String(params.year))
      if (params?.page) sp.set('page', String(params.page))
      if (params?.pageSize) sp.set('pageSize', String(params.pageSize))
      return apiFetch<PaginatedResponse<EDocument>>(`/api/library/edocs?${sp.toString()}`)
    },
  })
}

export function useGetEDocument(id: string) {
  return useQuery({
    queryKey: ['edocument', id],
    queryFn: () => apiFetch<EDocument>(`/api/library/edocs/${id}`),
    enabled: !!id,
  })
}
