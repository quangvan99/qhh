import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { DiscussionThread, DiscussionPost } from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

const TEACHER_AUTHORS = [
  { id: 'teacher-1', name: 'GV. Nguyễn Thị Hương', avatar: undefined, role: 'teacher' as const },
  { id: 'teacher-2', name: 'GV. Trần Văn Minh', avatar: undefined, role: 'teacher' as const },
]

const STUDENT_AUTHORS = [
  { id: 's-1', name: 'HS. Nguyễn Văn An', role: 'student' as const },
  { id: 's-2', name: 'HS. Trần Thị Bình', role: 'student' as const },
  { id: 's-3', name: 'HS. Lê Văn Cường', role: 'student' as const },
  { id: 's-4', name: 'HS. Phạm Thị Dung', role: 'student' as const },
  { id: 's-5', name: 'HS. Hoàng Văn Em', role: 'student' as const },
  { id: 's-6', name: 'HS. Vũ Thị Phương', role: 'student' as const },
  { id: 's-7', name: 'HS. Đặng Văn Giang', role: 'student' as const },
  { id: 's-8', name: 'HS. Bùi Thị Hà', role: 'student' as const },
]

const THREAD_DATA: Omit<DiscussionThread, 'id' | 'classId'>[] = [
  {
    title: '📢 [TB] Lịch thi giữa kỳ và hướng dẫn ôn tập',
    body: 'Các em học sinh thân mến, lịch thi giữa kỳ đã được xác nhận. Thi vào tuần 8 (từ 10/03 đến 15/03/2026). Đề thi sẽ bao gồm 40% lý thuyết và 60% thực hành. Các em cần ôn tập kỹ các chương 1-5. Đặc biệt chú ý phần thiết kế ERD và viết câu lệnh SQL cơ bản.',
    authorId: TEACHER_AUTHORS[0]!.id, authorName: TEACHER_AUTHORS[0]!.name, authorRole: 'teacher',
    isPinned: true, allowReplies: true, status: 'open',
    replyCount: 12, viewCount: 145, createdAt: '2026-02-28T08:00:00Z', updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    title: '📌 Hướng dẫn nộp bài tập và quy định lớp học',
    body: 'Kính gửi toàn thể học sinh, dưới đây là hướng dẫn nộp bài tập online và các quy định của lớp học. Bài tập phải nộp đúng hạn trên hệ thống. Không nhận bài qua email hay zalo. File nộp phải ở định dạng PDF hoặc DOCX. Tên file theo chuẩn: MSSV_TenBaiTap.pdf.',
    authorId: TEACHER_AUTHORS[0]!.id, authorName: TEACHER_AUTHORS[0]!.name, authorRole: 'teacher',
    isPinned: true, allowReplies: false, status: 'open',
    replyCount: 3, viewCount: 238, createdAt: '2026-02-15T07:00:00Z', updatedAt: '2026-02-15T07:00:00Z',
  },
  {
    title: 'Hỏi về bài tập chương 2 - ERD modeling',
    body: 'Thưa thầy/cô và các bạn, em đang làm bài tập chương 2 về ERD nhưng gặp khó khăn khi xác định cardinality giữa hai entity "Giảng viên" và "Môn học". Theo em hiểu thì một giảng viên có thể dạy nhiều môn, và một môn có thể được dạy bởi nhiều giảng viên, vậy đây là quan hệ N-N. Mong thầy/cô và các bạn góp ý.',
    authorId: STUDENT_AUTHORS[0]!.id, authorName: STUDENT_AUTHORS[0]!.name, authorRole: 'student',
    isPinned: false, allowReplies: true, status: 'open',
    replyCount: 8, viewCount: 67, createdAt: '2026-03-02T14:30:00Z', updatedAt: '2026-03-03T09:15:00Z',
  },
  {
    title: 'Thảo luận: So sánh kiến trúc CSDL quan hệ và phi quan hệ',
    body: 'Trong buổi học hôm nay thầy có đề cập đến sự khác biệt giữa SQL và NoSQL. Em muốn thảo luận thêm về chủ đề này. Theo quan điểm của em, SQL phù hợp hơn cho dữ liệu có cấu trúc rõ ràng và cần tính nhất quán cao, trong khi NoSQL linh hoạt hơn cho big data và real-time applications.',
    authorId: STUDENT_AUTHORS[1]!.id, authorName: STUDENT_AUTHORS[1]!.name, authorRole: 'student',
    isPinned: false, allowReplies: true, status: 'open',
    replyCount: 15, viewCount: 89, createdAt: '2026-03-03T09:00:00Z', updatedAt: '2026-03-04T16:20:00Z',
  },
  {
    title: 'Nhờ giải thích về NULL values trong SQL',
    body: 'Em chưa hiểu rõ về NULL trong SQL. Cụ thể là khi nào dùng IS NULL thay vì = NULL? Và tại sao NULL != NULL lại trả về TRUE?',
    authorId: STUDENT_AUTHORS[2]!.id, authorName: STUDENT_AUTHORS[2]!.name, authorRole: 'student',
    isPinned: false, allowReplies: true, status: 'open',
    replyCount: 6, viewCount: 54, createdAt: '2026-03-04T11:00:00Z', updatedAt: '2026-03-04T15:30:00Z',
  },
  {
    title: '📢 [TB] Thay đổi lịch học tuần 7',
    body: 'Thông báo: Do sự kiện trường tổ chức vào thứ 4 tuần sau, buổi học lý thuyết ngày 11/03 sẽ được chuyển sang thứ 6 ngày 13/03 cùng giờ và cùng phòng. Các em chú ý điều chỉnh lịch cá nhân.',
    authorId: TEACHER_AUTHORS[1]!.id, authorName: TEACHER_AUTHORS[1]!.name, authorRole: 'teacher',
    isPinned: false, allowReplies: true, status: 'open',
    replyCount: 20, viewCount: 187, createdAt: '2026-03-05T07:30:00Z', updatedAt: '2026-03-05T08:00:00Z',
  },
  {
    title: 'Bài tập nhóm: Cần tìm thêm thành viên',
    body: 'Nhóm em hiện có 3 người, cần thêm 1-2 bạn để hoàn thiện nhóm cho bài tập lớn chương 13. Dự án là xây dựng hệ thống quản lý thư viện online. Tech stack: Node.js + PostgreSQL. Ai muốn tham gia nhắn tin cho em nhé!',
    authorId: STUDENT_AUTHORS[3]!.id, authorName: STUDENT_AUTHORS[3]!.name, authorRole: 'student',
    isPinned: false, allowReplies: true, status: 'open',
    replyCount: 4, viewCount: 43, createdAt: '2026-03-06T10:00:00Z', updatedAt: '2026-03-06T14:00:00Z',
  },
  {
    title: 'Chia sẻ: Tài liệu học SQL hữu ích',
    body: 'Em muốn chia sẻ với cả lớp một số tài liệu học SQL mà em thấy rất hữu ích. 1) SQLZoo - website học SQL tương tác miễn phí. 2) Mode Analytics SQL Tutorial. 3) LeetCode Database section để luyện tập. 4) Book: Learning SQL by Alan Beaulieu.',
    authorId: STUDENT_AUTHORS[4]!.id, authorName: STUDENT_AUTHORS[4]!.name, authorRole: 'student',
    isPinned: false, allowReplies: true, status: 'open',
    replyCount: 11, viewCount: 102, createdAt: '2026-03-07T15:00:00Z', updatedAt: '2026-03-08T09:00:00Z',
  },
  {
    title: 'Hỏi về Normalization - 3NF vs BCNF',
    body: 'Thưa thầy, em đang ôn tập phần Normalization. Em hiểu được 1NF, 2NF và 3NF. Nhưng em chưa nắm rõ sự khác biệt giữa 3NF và BCNF. Khi nào thì cần đưa lên BCNF? Có thể cho em một ví dụ cụ thể không ạ?',
    authorId: STUDENT_AUTHORS[5]!.id, authorName: STUDENT_AUTHORS[5]!.name, authorRole: 'student',
    isPinned: false, allowReplies: true, status: 'open',
    replyCount: 5, viewCount: 61, createdAt: '2026-03-08T08:30:00Z', updatedAt: '2026-03-09T10:00:00Z',
  },
  {
    title: 'Góp ý chương trình học - Em nghĩ nên thêm phần Cloud DB',
    body: 'Em muốn góp ý về chương trình học. Hiện tại chúng ta học khá nhiều về on-premise database. Em nghĩ nếu có thêm 1-2 buổi về cloud databases như AWS RDS, Google Cloud SQL, hoặc Azure SQL sẽ rất thực tế vì đây là xu hướng của ngành.',
    authorId: STUDENT_AUTHORS[6]!.id, authorName: STUDENT_AUTHORS[6]!.name, authorRole: 'student',
    isPinned: false, allowReplies: true, status: 'open',
    replyCount: 9, viewCount: 78, createdAt: '2026-03-09T14:00:00Z', updatedAt: '2026-03-10T10:30:00Z',
  },
  {
    title: 'Hỏi về Transaction Isolation Levels',
    body: 'Em đang đọc về Transaction trong chương 9. Phần Isolation Levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) em thấy khá khó hiểu. Ví dụ Phantom Read xảy ra ở mức nào? Và trong thực tế người ta thường dùng mức nào?',
    authorId: STUDENT_AUTHORS[7]!.id, authorName: STUDENT_AUTHORS[7]!.name, authorRole: 'student',
    isPinned: false, allowReplies: true, status: 'open',
    replyCount: 7, viewCount: 55, createdAt: '2026-03-10T09:00:00Z', updatedAt: '2026-03-11T08:00:00Z',
  },
  {
    title: '[Đã đóng] Thảo luận bài tập chương 1 - tuần 1',
    body: 'Thread thảo luận bài tập tuần 1 đã kết thúc. Các em có thể xem lại giải đáp của giảng viên ở dưới.',
    authorId: TEACHER_AUTHORS[0]!.id, authorName: TEACHER_AUTHORS[0]!.name, authorRole: 'teacher',
    isPinned: false, allowReplies: false, status: 'closed',
    replyCount: 18, viewCount: 134, createdAt: '2026-02-10T08:00:00Z', updatedAt: '2026-02-24T10:00:00Z',
  },
  {
    title: '[Đã đóng] Chia sẻ kinh nghiệm thực tập - tuần 3',
    body: 'Thread chia sẻ kinh nghiệm thực tập đã đóng. Cảm ơn tất cả các em đã tham gia thảo luận tích cực!',
    authorId: TEACHER_AUTHORS[1]!.id, authorName: TEACHER_AUTHORS[1]!.name, authorRole: 'teacher',
    isPinned: false, allowReplies: false, status: 'closed',
    replyCount: 22, viewCount: 156, createdAt: '2026-02-17T10:00:00Z', updatedAt: '2026-03-03T16:00:00Z',
  },
  {
    title: 'Nhờ giúp đỡ: Lỗi khi cài đặt MySQL Workbench',
    body: 'Em đang cài đặt MySQL Workbench 8.0 trên Windows 11 nhưng gặp lỗi "Microsoft Visual C++ 2019 Redistributable Package (x64) is required". Em đã download và cài package đó rồi nhưng vẫn báo lỗi. Ai đã gặp lỗi này chưa?',
    authorId: STUDENT_AUTHORS[0]!.id, authorName: STUDENT_AUTHORS[0]!.name, authorRole: 'student',
    isPinned: false, allowReplies: true, status: 'open',
    replyCount: 5, viewCount: 48, createdAt: '2026-03-11T11:00:00Z', updatedAt: '2026-03-11T15:30:00Z',
  },
  {
    title: 'Kết quả bài kiểm tra 15 phút - thứ 4 tuần 6',
    body: 'Thầy/cô đã chấm xong bài kiểm tra 15 phút. Điểm trung bình cả lớp là 7.8/10. Các em có thể xem điểm chi tiết trên hệ thống. Bài có điểm thấp nhất là ở phần normalization, thầy sẽ giải lại vào buổi học tuần sau.',
    authorId: TEACHER_AUTHORS[0]!.id, authorName: TEACHER_AUTHORS[0]!.name, authorRole: 'teacher',
    isPinned: false, allowReplies: true, status: 'open',
    replyCount: 16, viewCount: 201, createdAt: '2026-03-12T07:00:00Z', updatedAt: '2026-03-12T09:00:00Z',
  },
]

const MOCK_THREADS: DiscussionThread[] = THREAD_DATA.map((t, i) => ({
  ...t,
  id: `thread-${i + 1}`,
  classId: '1',
}))

function generatePosts(threadId: string, count: number): DiscussionPost[] {
  const authors = [...TEACHER_AUTHORS, ...STUDENT_AUTHORS]
  const posts: DiscussionPost[] = []

  // Thread body / original post
  const threadIdx = parseInt(threadId.replace('thread-', ''), 10) - 1
  const threadData = THREAD_DATA[threadIdx]

  // Top-level replies
  const replyContents = [
    'Cảm ơn thầy/cô đã thông báo ạ! Em đã ghi chú lại rồi.',
    'Em cũng có thắc mắc tương tự, mong thầy/cô giải đáp.',
    'Em đồng ý với ý kiến trên. Theo em nghĩ thêm là...',
    'Phần này em hiểu rồi sau khi đọc thêm tài liệu. Cảm ơn!',
    'Thầy ơi, vậy trong trường hợp X thì xử lý như thế nào ạ?',
    'Em thử cách đó rồi nhưng vẫn không được ạ. Em sẽ thử lại.',
    'Hay quá! Em đã bookmark tài liệu này rồi.',
    'Em có câu hỏi liên quan: ...',
    'Cảm ơn bạn đã chia sẻ! Rất hữu ích.',
    'Em nghĩ cách đơn giản hơn là sử dụng JOIN thay vì subquery.',
    'Bạn có thể giải thích thêm phần này không?',
    'Giảng viên trả lời: Câu hỏi hay! Về vấn đề này, đáp án chính xác là...',
    'Em hiểu rồi ạ, cảm ơn thầy!',
    'Mình cũng gặp vấn đề tương tự, đã giải quyết bằng cách...',
    'Thread này rất hữu ích, thanks all!',
    'Em sẽ thử cách này và báo cáo kết quả sau.',
    'Mình đã kiểm tra và confirm rồi, hoạt động tốt.',
    'Cần bổ sung thêm: theo RFC 2396...',
    'Nhắc các bạn nhớ backup database trước khi thực hành!',
    'Great discussion! Keep it up everyone.',
  ]

  for (let i = 0; i < Math.min(count, replyContents.length); i++) {
    const author = authors[i % authors.length]!
    const postDate = new Date('2026-03-01T08:00:00Z')
    postDate.setHours(postDate.getHours() + i * 2 + parseInt(threadId.split('-')[1] ?? '1', 10))

    const post: DiscussionPost = {
      id: `post-${threadId}-${i + 1}`,
      threadId,
      parentId: undefined,
      authorId: author.id,
      authorName: author.name,
      authorRole: author.role,
      content: replyContents[i]!,
      createdAt: postDate.toISOString(),
    }

    posts.push(post)

    // Add nested reply (depth 1) for some posts
    if (i % 3 === 1 && i + 1 < count) {
      const replyAuthor = authors[(i + 3) % authors.length]!
      const nestedDate = new Date(postDate)
      nestedDate.setMinutes(nestedDate.getMinutes() + 30)
      const nested: DiscussionPost = {
        id: `post-${threadId}-${i + 1}-reply`,
        threadId,
        parentId: post.id,
        authorId: replyAuthor.id,
        authorName: replyAuthor.name,
        authorRole: replyAuthor.role,
        content: `Trả lời cho ${author.name}: Cảm ơn bạn, em cũng đồng ý quan điểm đó. Thêm vào đó...`,
        createdAt: nestedDate.toISOString(),
      }
      post.children = [nested]
    }
  }

  return posts
}

// Pre-generate posts for all threads
const MOCK_POSTS: Record<string, DiscussionPost[]> = {}
MOCK_THREADS.forEach((t) => {
  MOCK_POSTS[t.id] = generatePosts(t.id, t.replyCount)
})

// ─────────────────────────────────────────────────────────────────────────────
// Fetch helpers
// ─────────────────────────────────────────────────────────────────────────────

async function fetchDiscussions(classId: string, params?: { status?: string; sort?: string }): Promise<PaginatedResponse<DiscussionThread>> {
  try {
    return await apiFetch<PaginatedResponse<DiscussionThread>>(
      `/api/lms/classes/${classId}/discussions?${new URLSearchParams(params as Record<string, string>).toString()}`
    )
  } catch {
    let data = MOCK_THREADS.filter((t) => t.classId === classId || classId === '1')
    if (params?.status) data = data.filter((t) => t.status === params.status)
    // Pinned threads always first
    data = [...data].sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
    return {
      data,
      pagination: { page: 1, pageSize: data.length, total: data.length, totalPages: 1 },
    }
  }
}

async function fetchThread(threadId: string): Promise<ApiResponse<{ thread: DiscussionThread; posts: DiscussionPost[] }>> {
  try {
    return await apiFetch<ApiResponse<{ thread: DiscussionThread; posts: DiscussionPost[] }>>(
      `/api/discussions/${threadId}`
    )
  } catch {
    const thread = MOCK_THREADS.find((t) => t.id === threadId) ?? MOCK_THREADS[0]!
    const posts = MOCK_POSTS[threadId] ?? generatePosts(threadId, 8)
    return { data: { thread, posts }, success: true }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Query keys
// ─────────────────────────────────────────────────────────────────────────────

const keys = {
  discussions: (classId: string) => ['lms', 'discussions', classId] as const,
  thread: (threadId: string) => ['lms', 'discussions', 'thread', threadId] as const,
  posts: (threadId: string) => ['lms', 'discussions', 'posts', threadId] as const,
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

export function useGetDiscussions(classId: string, params?: { status?: string; sort?: string }) {
  return useQuery({
    queryKey: [...keys.discussions(classId), params],
    queryFn: () => fetchDiscussions(classId, params),
    enabled: !!classId,
  })
}

export function useGetDiscussionThread(threadId: string) {
  return useQuery({
    queryKey: keys.thread(threadId),
    queryFn: () => fetchThread(threadId),
    enabled: !!threadId,
  })
}

export function useCreateDiscussion(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<DiscussionThread>): Promise<ApiResponse<DiscussionThread>> => {
      try {
        return await apiFetch<ApiResponse<DiscussionThread>>(`/api/lms/classes/${classId}/discussions`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      } catch {
        const newThread: DiscussionThread = {
          id: `thread-${Date.now()}`,
          classId,
          title: (data.title as string) ?? 'Thảo luận mới',
          body: data.body ?? '',
          authorId: data.authorId ?? 'teacher-1',
          authorName: data.authorName ?? 'GV. Giáo viên',
          authorRole: data.authorRole ?? 'teacher',
          isPinned: data.isPinned ?? false,
          allowReplies: data.allowReplies ?? true,
          status: data.status ?? 'open',
          replyCount: 0,
          viewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        MOCK_THREADS.push(newThread)
        MOCK_POSTS[newThread.id] = []
        return { data: newThread, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.discussions(classId) })
    },
  })
}

export function useUpdateDiscussion(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { id: string } & Partial<DiscussionThread>): Promise<ApiResponse<DiscussionThread>> => {
      try {
        return await apiFetch<ApiResponse<DiscussionThread>>(`/api/lms/classes/${classId}/discussions/${data.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        })
      } catch {
        const idx = MOCK_THREADS.findIndex((t) => t.id === data.id)
        if (idx !== -1) {
          MOCK_THREADS[idx] = { ...MOCK_THREADS[idx]!, ...data, updatedAt: new Date().toISOString() }
        }
        return { data: MOCK_THREADS.find((t) => t.id === data.id) ?? MOCK_THREADS[0]!, success: true }
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: keys.discussions(classId) })
      qc.invalidateQueries({ queryKey: keys.thread(vars.id) })
    },
  })
}

export function useDeleteDiscussion(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<ApiResponse<void>> => {
      try {
        return await apiFetch<ApiResponse<void>>(`/api/lms/classes/${classId}/discussions/${id}`, {
          method: 'DELETE',
        })
      } catch {
        const idx = MOCK_THREADS.findIndex((t) => t.id === id)
        if (idx !== -1) MOCK_THREADS.splice(idx, 1)
        return { data: undefined as unknown as void, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.discussions(classId) })
    },
  })
}

export function useCreatePost(threadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { content: string; parentId?: string }): Promise<ApiResponse<DiscussionPost>> => {
      try {
        return await apiFetch<ApiResponse<DiscussionPost>>(`/api/discussions/${threadId}/posts`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      } catch {
        const newPost: DiscussionPost = {
          id: `post-${threadId}-new-${Date.now()}`,
          threadId,
          parentId: data.parentId,
          authorId: 'teacher-1',
          authorName: 'GV. Nguyễn Thị Hương',
          authorRole: 'teacher',
          content: data.content,
          createdAt: new Date().toISOString(),
        }
        if (!MOCK_POSTS[threadId]) MOCK_POSTS[threadId] = []
        MOCK_POSTS[threadId]!.push(newPost)
        // Update reply count
        const tIdx = MOCK_THREADS.findIndex((t) => t.id === threadId)
        if (tIdx !== -1) {
          MOCK_THREADS[tIdx] = { ...MOCK_THREADS[tIdx]!, replyCount: (MOCK_THREADS[tIdx]?.replyCount ?? 0) + 1 }
        }
        return { data: newPost, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.thread(threadId) })
      qc.invalidateQueries({ queryKey: keys.posts(threadId) })
    },
  })
}

export function useUpdatePost(threadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { postId: string; content: string }): Promise<ApiResponse<DiscussionPost>> => {
      try {
        return await apiFetch<ApiResponse<DiscussionPost>>(`/api/discussions/${threadId}/posts/${data.postId}`, {
          method: 'PUT',
          body: JSON.stringify({ content: data.content }),
        })
      } catch {
        const posts = MOCK_POSTS[threadId] ?? []
        const idx = posts.findIndex((p) => p.id === data.postId)
        if (idx !== -1) posts[idx] = { ...posts[idx]!, content: data.content }
        return { data: posts.find((p) => p.id === data.postId) ?? posts[0]!, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.thread(threadId) })
    },
  })
}

export function useDeletePost(threadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (postId: string): Promise<ApiResponse<void>> => {
      try {
        return await apiFetch<ApiResponse<void>>(`/api/discussions/${threadId}/posts/${postId}`, {
          method: 'DELETE',
        })
      } catch {
        const posts = MOCK_POSTS[threadId] ?? []
        const idx = posts.findIndex((p) => p.id === postId)
        if (idx !== -1) posts.splice(idx, 1)
        return { data: undefined as unknown as void, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.thread(threadId) })
    },
  })
}

export function useTogglePin(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { id: string; pinned: boolean }): Promise<ApiResponse<void>> => {
      try {
        return await apiFetch<ApiResponse<void>>(
          `/api/lms/classes/${classId}/discussions/${data.id}/pin`,
          { method: 'PUT', body: JSON.stringify({ pinned: data.pinned }) }
        )
      } catch {
        const idx = MOCK_THREADS.findIndex((t) => t.id === data.id)
        if (idx !== -1) MOCK_THREADS[idx] = { ...MOCK_THREADS[idx]!, isPinned: data.pinned }
        return { data: undefined as unknown as void, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.discussions(classId) })
    },
  })
}

/**
 * Close or reopen a discussion thread.
 */
export function useToggleClose(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { id: string; closed: boolean }): Promise<ApiResponse<void>> => {
      try {
        return await apiFetch<ApiResponse<void>>(
          `/api/lms/classes/${classId}/discussions/${data.id}/close`,
          { method: 'PUT', body: JSON.stringify({ closed: data.closed }) }
        )
      } catch {
        const idx = MOCK_THREADS.findIndex((t) => t.id === data.id)
        if (idx !== -1) {
          MOCK_THREADS[idx] = { ...MOCK_THREADS[idx]!, status: data.closed ? 'closed' : 'open' }
        }
        return { data: undefined as unknown as void, success: true }
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: keys.discussions(classId) })
      qc.invalidateQueries({ queryKey: keys.thread(vars.id) })
    },
  })
}

/**
 * Mark a reply post as the accepted answer (instructor only).
 */
export function useMarkAsAnswer(threadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (postId: string): Promise<ApiResponse<void>> => {
      try {
        return await apiFetch<ApiResponse<void>>(`/api/discussions/${threadId}/posts/${postId}/mark-answer`, {
          method: 'POST',
        })
      } catch {
        return { data: undefined as unknown as void, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.thread(threadId) })
    },
  })
}

/**
 * Like / unlike a post.
 */
export function useLikePost(threadId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { postId: string; liked: boolean }): Promise<ApiResponse<{ likeCount: number }>> => {
      try {
        return await apiFetch<ApiResponse<{ likeCount: number }>>(
          `/api/discussions/${threadId}/posts/${data.postId}/like`,
          { method: 'POST', body: JSON.stringify({ liked: data.liked }) }
        )
      } catch {
        return { data: { likeCount: data.liked ? 1 : 0 }, success: true }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.thread(threadId) })
    },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Composable feature hooks (re-export for convenience)
// ─────────────────────────────────────────────────────────────────────────────
export { useDiscussions } from './useDiscussions'
export { useThreadDetail } from './useThreadDetail'
