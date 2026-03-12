import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:8080'

const mockBooks = [
  {
    id: 'book-1',
    title: 'Toán học lớp 10',
    author: 'Nguyễn Văn A',
    isbn: '978-604-0-12345-6',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Giáo khoa' },
    availableCopies: 5,
    totalCopies: 8,
    status: 'available',
  },
  {
    id: 'book-2',
    title: 'Vật lý đại cương',
    author: 'Trần Thị B',
    isbn: '978-604-0-23456-7',
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Tham khảo' },
    availableCopies: 0,
    totalCopies: 3,
    status: 'borrowed',
  },
  {
    id: 'book-3',
    title: 'Lịch sử Việt Nam',
    author: 'Lê Hoàng C',
    isbn: '978-604-0-34567-8',
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Giáo khoa' },
    availableCopies: 2,
    totalCopies: 2,
    status: 'available',
  },
]

const mockMembers = [
  { id: 'mem-1', name: 'Nguyễn Thị Lan', studentCode: 'HS001', email: 'lan@school.edu.vn', status: 'active' },
  { id: 'mem-2', name: 'Trần Văn Minh', studentCode: 'HS002', email: 'minh@school.edu.vn', status: 'active' },
]

const mockBorrows = [
  {
    id: 'borrow-1',
    bookId: 'book-1',
    bookTitle: 'Toán học lớp 10',
    memberId: 'mem-1',
    memberName: 'Nguyễn Thị Lan',
    borrowDate: '2025-02-01',
    dueDate: '2025-03-01',
    returnDate: null,
    status: 'borrowed',
  },
  {
    id: 'borrow-2',
    bookId: 'book-3',
    bookTitle: 'Lịch sử Việt Nam',
    memberId: 'mem-2',
    memberName: 'Trần Văn Minh',
    borrowDate: '2025-01-15',
    dueDate: '2025-02-15',
    returnDate: '2025-02-14',
    status: 'returned',
  },
]

export const libraryHandlers = [
  // Categories
  http.get(`${BASE}/api/library/categories`, () =>
    HttpResponse.json([
      { id: 'cat-1', name: 'Giáo khoa', bookCount: 50 },
      { id: 'cat-2', name: 'Tham khảo', bookCount: 30 },
      { id: 'cat-3', name: 'Văn học', bookCount: 20 },
    ]),
  ),
  http.post(`${BASE}/api/library/categories`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'cat-new', ...body }, { status: 201 })
  }),
  http.put(`${BASE}/api/library/categories/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/library/categories/:id`, () => new HttpResponse(null, { status: 204 })),

  // Books
  http.get(`${BASE}/api/library/books`, () =>
    HttpResponse.json({ data: mockBooks, total: mockBooks.length, page: 1, pageSize: 10 }),
  ),
  http.get(`${BASE}/api/library/books/:id`, ({ params }) =>
    HttpResponse.json(mockBooks.find((b) => b.id === params['id']) ?? mockBooks[0]),
  ),
  http.post(`${BASE}/api/library/books`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'book-new', availableCopies: 1, totalCopies: 1, ...body }, { status: 201 })
  }),
  http.put(`${BASE}/api/library/books/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/library/books/:id`, () => new HttpResponse(null, { status: 204 })),

  // Members
  http.get(`${BASE}/api/library/members`, () =>
    HttpResponse.json({ data: mockMembers, total: mockMembers.length }),
  ),
  http.get(`${BASE}/api/library/members/:id`, ({ params }) =>
    HttpResponse.json(mockMembers.find((m) => m.id === params['id']) ?? mockMembers[0]),
  ),
  http.post(`${BASE}/api/library/members`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'mem-new', status: 'active', ...body }, { status: 201 })
  }),
  http.put(`${BASE}/api/library/members/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: params['id'], ...body })
  }),
  http.delete(`${BASE}/api/library/members/:id`, () => new HttpResponse(null, { status: 204 })),

  // Borrows
  http.get(`${BASE}/api/library/borrows`, () =>
    HttpResponse.json({ data: mockBorrows, total: mockBorrows.length }),
  ),
  http.post(`${BASE}/api/library/borrows`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'borrow-new', status: 'borrowed', ...body }, { status: 201 })
  }),
  http.post(`${BASE}/api/library/borrows/:id/return`, ({ params }) =>
    HttpResponse.json({ id: params['id'], status: 'returned', returnDate: new Date().toISOString() }),
  ),

  // OPAC (Portal)
  http.get(`${BASE}/api/library/opac/search`, () =>
    HttpResponse.json({ data: mockBooks, total: mockBooks.length, page: 1, pageSize: 20 }),
  ),
  http.get(`${BASE}/api/library/opac/books/:id`, ({ params }) => {
    const book = mockBooks.find((b) => b.id === params['id']) ?? mockBooks[0]
    return HttpResponse.json({
      ...book,
      publisher: 'NXB Giáo dục',
      publishYear: 2023,
      categoryName: book.category.name,
      description: 'Sách giáo khoa chính thức',
      copies: [
        { id: 'copy-1', bookId: book.id, copyCode: 'CB-001', condition: 'good', locationName: 'Kệ A1', isAvailable: true },
        { id: 'copy-2', bookId: book.id, copyCode: 'CB-002', condition: 'fair', locationName: 'Kệ A1', isAvailable: false },
      ],
    })
  }),

  // Stats
  http.get(`${BASE}/api/library/stats`, () =>
    HttpResponse.json({ totalBooks: 500, availableBooks: 350, totalMembers: 120, borrowsThisMonth: 45 }),
  ),

  // News
  http.get(`${BASE}/api/library/news`, () =>
    HttpResponse.json({
      data: [
        { id: 'news-1', title: 'Ngày hội đọc sách 2025', slug: 'ngay-hoi-doc-sach', publishedAt: '2025-03-01T00:00:00Z', tags: ['sự kiện'] },
        { id: 'news-2', title: 'Sách mới tháng 3', slug: 'sach-moi-thang-3', publishedAt: '2025-03-05T00:00:00Z', tags: ['tin tức'] },
      ],
      total: 2,
      page: 1,
      pageSize: 10,
    }),
  ),

  // Locations
  http.get(`${BASE}/api/library/locations`, () =>
    HttpResponse.json([
      { id: 'loc-1', name: 'Kệ A1', code: 'A1' },
      { id: 'loc-2', name: 'Kệ B2', code: 'B2' },
    ]),
  ),
]
