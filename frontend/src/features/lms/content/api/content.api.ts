import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type {
  ContentGroup, ScormItem, VideoItem, TextItem, FileItem, SurveyItem,
  OfflineSessionItem, ScormLibraryItem, SurveyReport,
} from "../types/content.types"
import type { PaginatedResponse } from "@/features/lms/classes/types/class.types"

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_CONTENT_GROUPS: ContentGroup[] = [
  {
    id: "cg-1",
    classId: "class-1",
    name: "Chương 1: Giới thiệu tổng quan",
    description: "Các nội dung cơ bản về môn học và phương pháp học tập",
    order: 1,
    visible: true,
    itemCount: 5,
    items: [
      { id: "item-1", groupId: "cg-1", type: "video", title: "Video giới thiệu môn học", status: "published", order: 1, createdAt: "2025-08-01T08:00:00Z" },
      { id: "item-2", groupId: "cg-1", type: "text", title: "Đề cương chi tiết", status: "published", order: 2, createdAt: "2025-08-01T09:00:00Z" },
      { id: "item-3", groupId: "cg-1", type: "file", title: "Tài liệu tham khảo chương 1", status: "published", order: 3, createdAt: "2025-08-02T08:00:00Z" },
      { id: "item-4", groupId: "cg-1", type: "scorm", title: "SCORM: Kiến thức nền tảng", status: "published", order: 4, createdAt: "2025-08-03T08:00:00Z" },
      { id: "item-5", groupId: "cg-1", type: "survey", title: "Khảo sát đầu khoá", status: "published", order: 5, createdAt: "2025-08-04T08:00:00Z" },
    ],
  },
  {
    id: "cg-2",
    classId: "class-1",
    name: "Chương 2: Nền tảng lý thuyết",
    description: "Các khái niệm và lý thuyết cốt lõi",
    order: 2,
    visible: true,
    itemCount: 4,
    items: [
      { id: "item-6", groupId: "cg-2", type: "scorm", title: "SCORM: Lý thuyết nâng cao", status: "published", order: 1, createdAt: "2025-08-10T08:00:00Z" },
      { id: "item-7", groupId: "cg-2", type: "video", title: "Bài giảng lý thuyết phần 1", status: "published", order: 2, createdAt: "2025-08-11T08:00:00Z" },
      { id: "item-8", groupId: "cg-2", type: "video", title: "Bài giảng lý thuyết phần 2", status: "draft", order: 3, createdAt: "2025-08-12T08:00:00Z" },
      { id: "item-9", groupId: "cg-2", type: "offline", title: "Buổi học trực tiếp #1", status: "published", order: 4, createdAt: "2025-08-13T08:00:00Z" },
    ],
  },
  {
    id: "cg-3",
    classId: "class-1",
    name: "Chương 3: Thực hành",
    description: "Bài tập và dự án thực hành",
    order: 3,
    visible: true,
    itemCount: 3,
    items: [
      { id: "item-10", groupId: "cg-3", type: "text", title: "Hướng dẫn thực hành", status: "published", order: 1, createdAt: "2025-09-01T08:00:00Z" },
      { id: "item-11", groupId: "cg-3", type: "file", title: "Bộ công cụ thực hành", status: "published", order: 2, createdAt: "2025-09-02T08:00:00Z" },
      { id: "item-12", groupId: "cg-3", type: "survey", title: "Đánh giá sau thực hành", status: "published", order: 3, createdAt: "2025-09-03T08:00:00Z" },
    ],
  },
  {
    id: "cg-4",
    classId: "class-1",
    name: "Chương 4: Kiểm tra & Đánh giá",
    description: "Nội dung ôn tập và kiểm tra cuối khoá",
    order: 4,
    visible: false,
    itemCount: 2,
    items: [
      { id: "item-13", groupId: "cg-4", type: "scorm", title: "SCORM: Ôn tập tổng hợp", status: "draft", order: 1, createdAt: "2025-09-15T08:00:00Z" },
      { id: "item-14", groupId: "cg-4", type: "survey", title: "Khảo sát cuối khoá", status: "draft", order: 2, createdAt: "2025-09-16T08:00:00Z" },
    ],
  },
]

const MOCK_SCORM_ITEMS: ScormItem[] = [
  {
    id: "scorm-1",
    groupId: "cg-1",
    type: "scorm",
    title: "SCORM: Kiến thức nền tảng",
    status: "published",
    order: 1,
    createdAt: "2025-08-03T08:00:00Z",
    fileUrl: "/api/scorm/packages/scorm-1.zip",
    fileSize: 15728640,
    launchUrl: "/scorm-player/scorm-1/index.html",
    completionType: "tracking",
    maxAttempts: 3,
  },
  {
    id: "scorm-2",
    groupId: "cg-2",
    type: "scorm",
    title: "SCORM: Lý thuyết nâng cao",
    status: "published",
    order: 1,
    createdAt: "2025-08-10T08:00:00Z",
    fileUrl: "/api/scorm/packages/scorm-2.zip",
    fileSize: 23068672,
    launchUrl: "/scorm-player/scorm-2/index.html",
    completionType: "score",
    minScore: 70,
    maxAttempts: 5,
  },
  {
    id: "scorm-3",
    groupId: "cg-4",
    type: "scorm",
    title: "SCORM: Ôn tập tổng hợp",
    status: "draft",
    order: 1,
    createdAt: "2025-09-15T08:00:00Z",
    fileUrl: "/api/scorm/packages/scorm-3.zip",
    fileSize: 31457280,
    launchUrl: "/scorm-player/scorm-3/index.html",
    completionType: "manual",
    maxAttempts: 1,
  },
]

const MOCK_VIDEO_ITEMS: VideoItem[] = [
  {
    id: "vid-1",
    groupId: "cg-1",
    type: "video",
    title: "Video giới thiệu môn học",
    status: "published",
    order: 1,
    createdAt: "2025-08-01T08:00:00Z",
    sourceType: "embed",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 612,
    posterUrl: "/api/thumbnails/vid-1.jpg",
  },
  {
    id: "vid-2",
    groupId: "cg-2",
    type: "video",
    title: "Bài giảng lý thuyết phần 1",
    status: "published",
    order: 2,
    createdAt: "2025-08-11T08:00:00Z",
    sourceType: "upload",
    url: "/api/videos/vid-2.mp4",
    duration: 2748,
    posterUrl: "/api/thumbnails/vid-2.jpg",
    captionsUrl: "/api/captions/vid-2.vtt",
  },
  {
    id: "vid-3",
    groupId: "cg-2",
    type: "video",
    title: "Bài giảng lý thuyết phần 2",
    status: "draft",
    order: 3,
    createdAt: "2025-08-12T08:00:00Z",
    sourceType: "embed",
    url: "https://vimeo.com/123456789",
    duration: 3120,
    posterUrl: "/api/thumbnails/vid-3.jpg",
  },
]

const MOCK_TEXT_ITEMS: TextItem[] = [
  {
    id: "text-1",
    groupId: "cg-1",
    type: "text",
    title: "Đề cương chi tiết",
    status: "published",
    order: 2,
    createdAt: "2025-08-01T09:00:00Z",
    content: `<h2>Đề cương môn học</h2>
<p>Môn học cung cấp kiến thức nền tảng và nâng cao về lĩnh vực chuyên ngành, giúp học viên nắm vững lý thuyết và vận dụng vào thực tiễn.</p>
<h3>Mục tiêu môn học</h3>
<ul>
  <li>Hiểu các khái niệm cơ bản và nâng cao</li>
  <li>Vận dụng kiến thức vào giải quyết bài toán thực tế</li>
  <li>Phát triển tư duy phân tích và sáng tạo</li>
</ul>
<h3>Nội dung chương trình</h3>
<ol>
  <li>Chương 1: Giới thiệu tổng quan (5 tiết)</li>
  <li>Chương 2: Nền tảng lý thuyết (10 tiết)</li>
  <li>Chương 3: Thực hành (8 tiết)</li>
  <li>Chương 4: Kiểm tra & Đánh giá (2 tiết)</li>
</ol>`,
    attachments: [
      { id: "att-1", name: "de-cuong-chi-tiet.pdf", url: "/api/attachments/att-1.pdf", size: 524288, type: "application/pdf" },
    ],
  },
  {
    id: "text-2",
    groupId: "cg-3",
    type: "text",
    title: "Hướng dẫn thực hành",
    status: "published",
    order: 1,
    createdAt: "2025-09-01T08:00:00Z",
    content: `<h2>Hướng dẫn thực hành</h2>
<p>Học viên thực hiện các bài tập theo hướng dẫn chi tiết dưới đây.</p>
<h3>Bước 1: Chuẩn bị môi trường</h3>
<p>Cài đặt đầy đủ các công cụ cần thiết theo danh sách đính kèm.</p>
<h3>Bước 2: Thực hiện bài tập</h3>
<p>Làm theo từng bước trong tài liệu hướng dẫn. Ghi chép kết quả vào mẫu báo cáo.</p>
<h3>Bước 3: Nộp bài</h3>
<p>Nộp báo cáo qua hệ thống trước deadline quy định.</p>`,
    attachments: [
      { id: "att-2", name: "huong-dan-thuc-hanh.pdf", url: "/api/attachments/att-2.pdf", size: 1048576, type: "application/pdf" },
      { id: "att-3", name: "mau-bao-cao.docx", url: "/api/attachments/att-3.docx", size: 262144, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    ],
  },
]

const MOCK_FILE_ITEMS: FileItem[] = [
  {
    id: "file-1",
    groupId: "cg-1",
    type: "file",
    title: "Tài liệu tham khảo chương 1",
    status: "published",
    order: 3,
    createdAt: "2025-08-02T08:00:00Z",
    fileUrl: "/api/files/file-1.pdf",
    fileName: "tai-lieu-tham-khao-chuong-1.pdf",
    fileSize: 3145728,
    fileType: "application/pdf",
    description: "Tổng hợp tài liệu tham khảo cho chương 1",
  },
  {
    id: "file-2",
    groupId: "cg-3",
    type: "file",
    title: "Bộ công cụ thực hành",
    status: "published",
    order: 2,
    createdAt: "2025-09-02T08:00:00Z",
    fileUrl: "/api/files/file-2.zip",
    fileName: "bo-cong-cu-thuc-hanh.zip",
    fileSize: 52428800,
    fileType: "application/zip",
    description: "Bộ công cụ và template cho bài thực hành",
  },
  {
    id: "file-3",
    groupId: "cg-2",
    type: "file",
    title: "Slide bài giảng chương 2",
    status: "published",
    order: 5,
    createdAt: "2025-08-14T08:00:00Z",
    fileUrl: "/api/files/file-3.pptx",
    fileName: "slide-bai-giang-chuong-2.pptx",
    fileSize: 8388608,
    fileType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    description: "Slide PowerPoint bài giảng chương 2",
  },
]

const MOCK_SURVEY_ITEMS: SurveyItem[] = [
  {
    id: "survey-1",
    groupId: "cg-1",
    type: "survey",
    title: "Khảo sát đầu khoá",
    status: "published",
    order: 5,
    createdAt: "2025-08-04T08:00:00Z",
    anonymous: true,
    showResults: false,
    maxAttempts: 1,
    deadline: "2025-08-15T23:59:59Z",
    questions: [
      {
        id: "q-1-1",
        type: "radio",
        content: "Trình độ hiện tại của bạn về lĩnh vực này?",
        required: true,
        order: 1,
        options: [
          { id: "opt-1-1-1", label: "Chưa biết gì" },
          { id: "opt-1-1-2", label: "Biết cơ bản" },
          { id: "opt-1-1-3", label: "Có kinh nghiệm" },
          { id: "opt-1-1-4", label: "Chuyên gia" },
        ],
      },
      {
        id: "q-1-2",
        type: "checkbox",
        content: "Bạn mong muốn học được gì từ khoá học này? (Chọn nhiều đáp án)",
        required: true,
        order: 2,
        options: [
          { id: "opt-1-2-1", label: "Kiến thức lý thuyết" },
          { id: "opt-1-2-2", label: "Kỹ năng thực hành" },
          { id: "opt-1-2-3", label: "Chứng chỉ" },
          { id: "opt-1-2-4", label: "Cơ hội nghề nghiệp" },
        ],
      },
      {
        id: "q-1-3",
        type: "scale",
        content: "Bạn đánh giá mức độ quan trọng của môn học này như thế nào?",
        required: true,
        order: 3,
        scaleMin: 1,
        scaleMax: 5,
      },
      {
        id: "q-1-4",
        type: "text",
        content: "Bạn có kỳ vọng gì khác từ khoá học?",
        required: false,
        order: 4,
        maxLength: 500,
        placeholder: "Nhập kỳ vọng của bạn...",
      },
    ],
  },
  {
    id: "survey-2",
    groupId: "cg-3",
    type: "survey",
    title: "Đánh giá sau thực hành",
    status: "published",
    order: 3,
    createdAt: "2025-09-03T08:00:00Z",
    anonymous: false,
    showResults: true,
    maxAttempts: 1,
    questions: [
      {
        id: "q-2-1",
        type: "scale",
        content: "Bài thực hành có phù hợp với kiến thức lý thuyết không?",
        required: true,
        order: 1,
        scaleMin: 1,
        scaleMax: 5,
      },
      {
        id: "q-2-2",
        type: "radio",
        content: "Thời lượng thực hành có đủ không?",
        required: true,
        order: 2,
        options: [
          { id: "opt-2-2-1", label: "Quá ngắn" },
          { id: "opt-2-2-2", label: "Vừa đủ" },
          { id: "opt-2-2-3", label: "Quá dài" },
        ],
      },
      {
        id: "q-2-3",
        type: "text",
        content: "Góp ý để cải thiện bài thực hành",
        required: false,
        order: 3,
        maxLength: 1000,
        placeholder: "Nhập góp ý của bạn...",
      },
    ],
  },
  {
    id: "survey-3",
    groupId: "cg-4",
    type: "survey",
    title: "Khảo sát cuối khoá",
    status: "draft",
    order: 2,
    createdAt: "2025-09-16T08:00:00Z",
    anonymous: true,
    showResults: false,
    maxAttempts: 1,
    deadline: "2025-10-31T23:59:59Z",
    questions: [
      {
        id: "q-3-1",
        type: "scale",
        content: "Bạn đánh giá chất lượng tổng thể của khoá học?",
        required: true,
        order: 1,
        scaleMin: 1,
        scaleMax: 10,
      },
      {
        id: "q-3-2",
        type: "checkbox",
        content: "Điểm nào của khoá học cần cải thiện?",
        required: true,
        order: 2,
        options: [
          { id: "opt-3-2-1", label: "Nội dung lý thuyết" },
          { id: "opt-3-2-2", label: "Bài thực hành" },
          { id: "opt-3-2-3", label: "Tài liệu" },
          { id: "opt-3-2-4", label: "Hỗ trợ từ giảng viên" },
          { id: "opt-3-2-5", label: "Hệ thống học trực tuyến" },
        ],
      },
      {
        id: "q-3-3",
        type: "radio",
        content: "Bạn có giới thiệu khoá học này cho người khác không?",
        required: true,
        order: 3,
        options: [
          { id: "opt-3-3-1", label: "Chắc chắn có" },
          { id: "opt-3-3-2", label: "Có thể có" },
          { id: "opt-3-3-3", label: "Không chắc" },
          { id: "opt-3-3-4", label: "Không" },
        ],
      },
      {
        id: "q-3-4",
        type: "text",
        content: "Nhận xét và góp ý tổng thể",
        required: false,
        order: 4,
        maxLength: 2000,
        placeholder: "Chia sẻ ý kiến của bạn...",
      },
    ],
  },
]

const MOCK_OFFLINE_SESSIONS: OfflineSessionItem[] = [
  {
    id: "offline-1",
    groupId: "cg-2",
    type: "offline",
    title: "Buổi học trực tiếp #1",
    status: "published",
    order: 4,
    createdAt: "2025-08-13T08:00:00Z",
    date: "2025-09-05",
    startTime: "08:00",
    endTime: "11:30",
    location: "Phòng A101 - Tòa nhà A",
    description: "Buổi học trực tiếp đầu tiên: Ôn tập và giải đáp thắc mắc chương 1 & 2",
    expectedAttendees: 35,
    sessionStatus: "completed",
    attachments: [
      { id: "att-off-1", name: "slide-buoi-1.pptx", url: "/api/attachments/att-off-1.pptx", size: 5242880, type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    ],
  },
  {
    id: "offline-2",
    groupId: "cg-2",
    type: "offline",
    title: "Buổi học trực tiếp #2",
    status: "published",
    order: 5,
    createdAt: "2025-08-13T09:00:00Z",
    date: "2025-10-10",
    startTime: "13:30",
    endTime: "17:00",
    location: "Phòng B203 - Tòa nhà B",
    description: "Buổi học trực tiếp thứ hai: Thực hành chương 3",
    expectedAttendees: 35,
    sessionStatus: "upcoming",
    attachments: [],
  },
]

const MOCK_SCORM_LIBRARY: ScormLibraryItem[] = [
  {
    id: "lib-1",
    name: "An toàn thông tin cơ bản",
    thumbnail: "/api/thumbnails/lib-1.jpg",
    fileSize: 18874368,
    createdAt: "2024-06-01T00:00:00Z",
    usageCount: 12,
  },
  {
    id: "lib-2",
    name: "Quản lý dự án theo Agile",
    thumbnail: "/api/thumbnails/lib-2.jpg",
    fileSize: 25165824,
    createdAt: "2024-07-15T00:00:00Z",
    usageCount: 8,
  },
  {
    id: "lib-3",
    name: "Kỹ năng giao tiếp chuyên nghiệp",
    thumbnail: "/api/thumbnails/lib-3.jpg",
    fileSize: 13631488,
    createdAt: "2024-08-20T00:00:00Z",
    usageCount: 20,
  },
  {
    id: "lib-4",
    name: "Excel nâng cao cho doanh nghiệp",
    thumbnail: "/api/thumbnails/lib-4.jpg",
    fileSize: 31457280,
    createdAt: "2024-09-10T00:00:00Z",
    usageCount: 15,
  },
  {
    id: "lib-5",
    name: "Lập trình Python cơ bản",
    thumbnail: "/api/thumbnails/lib-5.jpg",
    fileSize: 40894464,
    createdAt: "2024-10-01T00:00:00Z",
    usageCount: 25,
  },
  {
    id: "lib-6",
    name: "Tuân thủ pháp luật trong doanh nghiệp",
    thumbnail: "/api/thumbnails/lib-6.jpg",
    fileSize: 10485760,
    createdAt: "2024-11-05T00:00:00Z",
    usageCount: 5,
  },
  {
    id: "lib-7",
    name: "Phòng cháy chữa cháy",
    thumbnail: "/api/thumbnails/lib-7.jpg",
    fileSize: 8388608,
    createdAt: "2024-12-01T00:00:00Z",
    usageCount: 30,
  },
  {
    id: "lib-8",
    name: "Kỹ năng lãnh đạo & quản lý nhóm",
    thumbnail: "/api/thumbnails/lib-8.jpg",
    fileSize: 22020096,
    createdAt: "2025-01-10T00:00:00Z",
    usageCount: 10,
  },
  {
    id: "lib-9",
    name: "Chuyển đổi số trong tổ chức",
    thumbnail: "/api/thumbnails/lib-9.jpg",
    fileSize: 35651584,
    createdAt: "2025-02-14T00:00:00Z",
    usageCount: 7,
  },
  {
    id: "lib-10",
    name: "Bảo hộ lao động & an toàn sản xuất",
    thumbnail: "/api/thumbnails/lib-10.jpg",
    fileSize: 14680064,
    createdAt: "2025-03-01T00:00:00Z",
    usageCount: 18,
  },
]

const MOCK_SURVEY_REPORT: Record<string, SurveyReport> = {
  "survey-1": {
    surveyId: "survey-1",
    totalResponses: 28,
    totalStudents: 35,
    completionRate: 80,
    questionReports: [
      {
        questionId: "q-1-1",
        question: "Trình độ hiện tại của bạn về lĩnh vực này?",
        type: "radio",
        optionCounts: [
          { label: "Chưa biết gì", count: 5 },
          { label: "Biết cơ bản", count: 14 },
          { label: "Có kinh nghiệm", count: 8 },
          { label: "Chuyên gia", count: 1 },
        ],
      },
      {
        questionId: "q-1-2",
        question: "Bạn mong muốn học được gì từ khoá học này?",
        type: "checkbox",
        optionCounts: [
          { label: "Kiến thức lý thuyết", count: 20 },
          { label: "Kỹ năng thực hành", count: 25 },
          { label: "Chứng chỉ", count: 18 },
          { label: "Cơ hội nghề nghiệp", count: 12 },
        ],
      },
      {
        questionId: "q-1-3",
        question: "Bạn đánh giá mức độ quan trọng của môn học này như thế nào?",
        type: "scale",
        optionCounts: [
          { label: "1", count: 0 },
          { label: "2", count: 1 },
          { label: "3", count: 5 },
          { label: "4", count: 12 },
          { label: "5", count: 10 },
        ],
      },
      {
        questionId: "q-1-4",
        question: "Bạn có kỳ vọng gì khác từ khoá học?",
        type: "text",
        textResponses: [
          "Muốn có nhiều bài tập thực hành hơn",
          "Hy vọng có thêm tài liệu tiếng Việt",
          "Mong muốn được kết nối với các chuyên gia trong ngành",
          "Muốn học theo nhóm nhỏ để thảo luận sâu hơn",
        ],
      },
    ],
  },
  "survey-2": {
    surveyId: "survey-2",
    totalResponses: 32,
    totalStudents: 35,
    completionRate: 91,
    questionReports: [
      {
        questionId: "q-2-1",
        question: "Bài thực hành có phù hợp với kiến thức lý thuyết không?",
        type: "scale",
        optionCounts: [
          { label: "1", count: 0 },
          { label: "2", count: 2 },
          { label: "3", count: 8 },
          { label: "4", count: 15 },
          { label: "5", count: 7 },
        ],
      },
      {
        questionId: "q-2-2",
        question: "Thời lượng thực hành có đủ không?",
        type: "radio",
        optionCounts: [
          { label: "Quá ngắn", count: 10 },
          { label: "Vừa đủ", count: 18 },
          { label: "Quá dài", count: 4 },
        ],
      },
      {
        questionId: "q-2-3",
        question: "Góp ý để cải thiện bài thực hành",
        type: "text",
        textResponses: [
          "Cần thêm 30 phút cho phần Q&A",
          "Bài tập nên có nhiều mức độ khó khác nhau",
          "Tài liệu hướng dẫn cần chi tiết hơn",
        ],
      },
    ],
  },
  "survey-3": {
    surveyId: "survey-3",
    totalResponses: 0,
    totalStudents: 35,
    completionRate: 0,
    questionReports: [],
  },
}

// ---------------------------------------------------------------------------
// Fetch helpers with mock fallback
// ---------------------------------------------------------------------------

async function fetchContentGroups(classId: string): Promise<ContentGroup[]> {
  try {
    return await apiFetch<ContentGroup[]>(`/api/lms/classes/${classId}/content-groups`)
  } catch {
    return MOCK_CONTENT_GROUPS.filter((g) => g.classId === classId).length > 0
      ? MOCK_CONTENT_GROUPS
      : MOCK_CONTENT_GROUPS
  }
}

async function fetchScormItems(classId: string, groupId: string): Promise<ScormItem[]> {
  try {
    return await apiFetch<ScormItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/scorm`)
  } catch {
    return MOCK_SCORM_ITEMS.filter((s) => s.groupId === groupId)
  }
}

async function fetchVideoItems(classId: string, groupId: string): Promise<VideoItem[]> {
  try {
    return await apiFetch<VideoItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/video`)
  } catch {
    return MOCK_VIDEO_ITEMS.filter((v) => v.groupId === groupId)
  }
}

async function fetchTextItems(classId: string, groupId: string): Promise<TextItem[]> {
  try {
    return await apiFetch<TextItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/text`)
  } catch {
    return MOCK_TEXT_ITEMS.filter((t) => t.groupId === groupId)
  }
}

async function fetchFileItems(classId: string, groupId: string): Promise<FileItem[]> {
  try {
    return await apiFetch<FileItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/file`)
  } catch {
    return MOCK_FILE_ITEMS.filter((f) => f.groupId === groupId)
  }
}

async function fetchSurveyItems(classId: string, groupId: string): Promise<SurveyItem[]> {
  try {
    return await apiFetch<SurveyItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/survey`)
  } catch {
    return MOCK_SURVEY_ITEMS.filter((s) => s.groupId === groupId)
  }
}

async function fetchOfflineSessions(classId: string, groupId: string): Promise<OfflineSessionItem[]> {
  try {
    return await apiFetch<OfflineSessionItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/offline`)
  } catch {
    return MOCK_OFFLINE_SESSIONS.filter((o) => o.groupId === groupId)
  }
}

async function fetchScormLibrary(search?: string): Promise<PaginatedResponse<ScormLibraryItem>> {
  try {
    return await apiFetch<PaginatedResponse<ScormLibraryItem>>(
      `/api/scorm-library${search ? `?q=${encodeURIComponent(search)}` : ""}`
    )
  } catch {
    const filtered = search
      ? MOCK_SCORM_LIBRARY.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      : MOCK_SCORM_LIBRARY
    return {
      data: filtered,
      total: filtered.length,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    }
  }
}

async function fetchSurveyReport(surveyId: string): Promise<SurveyReport> {
  try {
    return await apiFetch<SurveyReport>(`/api/lms/surveys/${surveyId}/report`)
  } catch {
    return (
      MOCK_SURVEY_REPORT[surveyId] ?? {
        surveyId,
        totalResponses: 0,
        totalStudents: 0,
        completionRate: 0,
        questionReports: [],
      }
    )
  }
}

// Mock mutation helpers (return success immediately)
async function mutateWithFallback<T>(
  apiFn: () => Promise<T>,
  mockResult: T
): Promise<T> {
  try {
    return await apiFn()
  } catch {
    return mockResult
  }
}

// ---------------------------------------------------------------------------
// Query Keys
// ---------------------------------------------------------------------------

const CONTENT_KEY = (classId: string) => ["lms", "classes", classId, "content"]
const SCORM_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "scorm"]
const VIDEO_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "video"]
const TEXT_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "text"]
const FILE_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "file"]
const SURVEY_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "survey"]
const OFFLINE_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "offline"]

// ---------------------------------------------------------------------------
// Content Groups
// ---------------------------------------------------------------------------

export function useGetContentGroups(classId: string) {
  return useQuery({
    queryKey: CONTENT_KEY(classId),
    queryFn: () => fetchContentGroups(classId),
    enabled: !!classId,
  })
}

export function useCreateGroup(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; description?: string; visible: boolean }) =>
      mutateWithFallback(
        () => apiFetch<ContentGroup>(`/api/lms/classes/${classId}/content-groups`, {
          method: "POST",
          body: JSON.stringify(data),
        }),
        {
          id: `cg-${Date.now()}`,
          classId,
          name: data.name,
          description: data.description,
          order: MOCK_CONTENT_GROUPS.length + 1,
          visible: data.visible,
          itemCount: 0,
          items: [],
        } as ContentGroup
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) }) },
  })
}

export function useUpdateGroup(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ groupId, ...data }: { groupId: string; name: string; description?: string; visible: boolean }) =>
      mutateWithFallback(
        () => apiFetch<ContentGroup>(`/api/lms/classes/${classId}/content-groups/${groupId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
        {
          ...(MOCK_CONTENT_GROUPS.find((g) => g.id === groupId) ?? MOCK_CONTENT_GROUPS[0]),
          ...data,
        } as ContentGroup
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) }) },
  })
}

export function useDeleteGroup(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (groupId: string) =>
      mutateWithFallback(
        () => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}`, { method: "DELETE" }),
        undefined
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) }) },
  })
}

export function useReorderGroups(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (groupIds: string[]) =>
      mutateWithFallback(
        () => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/reorder`, {
          method: "PUT",
          body: JSON.stringify({ groupIds }),
        }),
        undefined
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) }) },
  })
}

export function useCopyContentFromClass(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sourceClassId, groupIds }: { sourceClassId: string; groupIds: string[] }) =>
      mutateWithFallback(
        () => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/copy-from/${sourceClassId}`, {
          method: "POST",
          body: JSON.stringify({ groupIds }),
        }),
        undefined
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) }) },
  })
}

// ---------------------------------------------------------------------------
// SCORM
// ---------------------------------------------------------------------------

export function useGetScormItems(classId: string, groupId: string) {
  return useQuery({
    queryKey: SCORM_KEY(classId, groupId),
    queryFn: () => fetchScormItems(classId, groupId),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateScorm(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      mutateWithFallback(
        () => apiFetch<ScormItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/scorm`, {
          method: "POST",
          body: data,
          headers: {},
        }),
        {
          id: `scorm-${Date.now()}`,
          groupId,
          type: "scorm",
          title: (data.get("title") as string) ?? "SCORM mới",
          status: "draft",
          order: MOCK_SCORM_ITEMS.filter((s) => s.groupId === groupId).length + 1,
          createdAt: new Date().toISOString(),
          fileUrl: "/api/scorm/packages/new.zip",
          fileSize: 0,
          completionType: "tracking",
        } as ScormItem
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCORM_KEY(classId, groupId) })
      qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) })
    },
  })
}

export function useUpdateScorm(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string; title: string; description?: string; completionType: string; minScore?: number; maxAttempts?: number }) =>
      mutateWithFallback(
        () => apiFetch<ScormItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/scorm/${itemId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
        {
          ...(MOCK_SCORM_ITEMS.find((s) => s.id === itemId) ?? MOCK_SCORM_ITEMS[0]),
          ...data,
        } as ScormItem
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SCORM_KEY(classId, groupId) }) },
  })
}

export function useDeleteScorm(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) =>
      mutateWithFallback(
        () => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/scorm/${itemId}`, { method: "DELETE" }),
        undefined
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCORM_KEY(classId, groupId) })
      qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) })
    },
  })
}

export function useGetScormLibrary(search?: string) {
  return useQuery({
    queryKey: ["scorm-library", search],
    queryFn: () => fetchScormLibrary(search),
  })
}

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------

export function useGetVideoItems(classId: string, groupId: string) {
  return useQuery({
    queryKey: VIDEO_KEY(classId, groupId),
    queryFn: () => fetchVideoItems(classId, groupId),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateVideo(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      mutateWithFallback(
        () => apiFetch<VideoItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/video`, {
          method: "POST",
          body: data,
          headers: {},
        }),
        {
          id: `vid-${Date.now()}`,
          groupId,
          type: "video",
          title: (data.get("title") as string) ?? "Video mới",
          status: "draft",
          order: MOCK_VIDEO_ITEMS.filter((v) => v.groupId === groupId).length + 1,
          createdAt: new Date().toISOString(),
          sourceType: (data.get("sourceType") as "upload" | "embed") ?? "upload",
          url: (data.get("url") as string) ?? "",
        } as VideoItem
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: VIDEO_KEY(classId, groupId) }) },
  })
}

export function useUpdateVideo(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string; title: string; url?: string; description?: string }) =>
      mutateWithFallback(
        () => apiFetch<VideoItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/video/${itemId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
        {
          ...(MOCK_VIDEO_ITEMS.find((v) => v.id === itemId) ?? MOCK_VIDEO_ITEMS[0]),
          ...data,
        } as VideoItem
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: VIDEO_KEY(classId, groupId) }) },
  })
}

export function useDeleteVideo(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) =>
      mutateWithFallback(
        () => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/video/${itemId}`, { method: "DELETE" }),
        undefined
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: VIDEO_KEY(classId, groupId) }) },
  })
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

export function useGetTextItems(classId: string, groupId: string) {
  return useQuery({
    queryKey: TEXT_KEY(classId, groupId),
    queryFn: () => fetchTextItems(classId, groupId),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateText(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      mutateWithFallback(
        () => apiFetch<TextItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/text`, {
          method: "POST",
          body: JSON.stringify(data),
        }),
        {
          id: `text-${Date.now()}`,
          groupId,
          type: "text",
          title: data.title,
          status: "draft",
          order: MOCK_TEXT_ITEMS.filter((t) => t.groupId === groupId).length + 1,
          createdAt: new Date().toISOString(),
          content: data.content,
          attachments: [],
        } as TextItem
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: TEXT_KEY(classId, groupId) }) },
  })
}

export function useUpdateText(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string; title: string; content: string }) =>
      mutateWithFallback(
        () => apiFetch<TextItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/text/${itemId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
        {
          ...(MOCK_TEXT_ITEMS.find((t) => t.id === itemId) ?? MOCK_TEXT_ITEMS[0]),
          ...data,
        } as TextItem
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: TEXT_KEY(classId, groupId) }) },
  })
}

export function useDeleteText(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) =>
      mutateWithFallback(
        () => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/text/${itemId}`, { method: "DELETE" }),
        undefined
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: TEXT_KEY(classId, groupId) }) },
  })
}

// ---------------------------------------------------------------------------
// File
// ---------------------------------------------------------------------------

export function useGetFileItems(classId: string, groupId: string) {
  return useQuery({
    queryKey: FILE_KEY(classId, groupId),
    queryFn: () => fetchFileItems(classId, groupId),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateFile(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      mutateWithFallback(
        () => apiFetch<FileItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/file`, {
          method: "POST",
          body: data,
          headers: {},
        }),
        {
          id: `file-${Date.now()}`,
          groupId,
          type: "file",
          title: (data.get("title") as string) ?? "File mới",
          status: "draft",
          order: MOCK_FILE_ITEMS.filter((f) => f.groupId === groupId).length + 1,
          createdAt: new Date().toISOString(),
          fileUrl: "/api/files/new",
          fileName: (data.get("fileName") as string) ?? "file",
          fileSize: 0,
          fileType: (data.get("fileType") as string) ?? "application/octet-stream",
          description: (data.get("description") as string) ?? undefined,
        } as FileItem
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FILE_KEY(classId, groupId) }) },
  })
}

export function useUpdateFile(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string; title: string; description?: string }) =>
      mutateWithFallback(
        () => apiFetch<FileItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/file/${itemId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
        {
          ...(MOCK_FILE_ITEMS.find((f) => f.id === itemId) ?? MOCK_FILE_ITEMS[0]),
          ...data,
        } as FileItem
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FILE_KEY(classId, groupId) }) },
  })
}

export function useDeleteFile(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) =>
      mutateWithFallback(
        () => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/file/${itemId}`, { method: "DELETE" }),
        undefined
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FILE_KEY(classId, groupId) }) },
  })
}

// ---------------------------------------------------------------------------
// Survey
// ---------------------------------------------------------------------------

export function useGetSurveyItems(classId: string, groupId: string) {
  return useQuery({
    queryKey: SURVEY_KEY(classId, groupId),
    queryFn: () => fetchSurveyItems(classId, groupId),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateSurvey(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SurveyItem>) =>
      mutateWithFallback(
        () => apiFetch<SurveyItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/survey`, {
          method: "POST",
          body: JSON.stringify(data),
        }),
        {
          id: `survey-${Date.now()}`,
          groupId,
          type: "survey",
          title: data.title ?? "Khảo sát mới",
          status: "draft",
          order: MOCK_SURVEY_ITEMS.filter((s) => s.groupId === groupId).length + 1,
          createdAt: new Date().toISOString(),
          anonymous: data.anonymous ?? false,
          showResults: data.showResults ?? false,
          maxAttempts: data.maxAttempts ?? 1,
          deadline: data.deadline,
          questions: data.questions ?? [],
        } as SurveyItem
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SURVEY_KEY(classId, groupId) }) },
  })
}

export function useUpdateSurvey(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string } & Partial<SurveyItem>) =>
      mutateWithFallback(
        () => apiFetch<SurveyItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/survey/${itemId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
        {
          ...(MOCK_SURVEY_ITEMS.find((s) => s.id === itemId) ?? MOCK_SURVEY_ITEMS[0]),
          ...data,
        } as SurveyItem
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SURVEY_KEY(classId, groupId) }) },
  })
}

export function useDeleteSurvey(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) =>
      mutateWithFallback(
        () => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/survey/${itemId}`, { method: "DELETE" }),
        undefined
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SURVEY_KEY(classId, groupId) }) },
  })
}

export function useGetSurveyReport(surveyId: string) {
  return useQuery({
    queryKey: ["survey", surveyId, "report"],
    queryFn: () => fetchSurveyReport(surveyId),
    enabled: !!surveyId,
  })
}

// ---------------------------------------------------------------------------
// Offline Sessions
// ---------------------------------------------------------------------------

export function useGetOfflineSessions(classId: string, groupId: string) {
  return useQuery({
    queryKey: OFFLINE_KEY(classId, groupId),
    queryFn: () => fetchOfflineSessions(classId, groupId),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateOffline(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      mutateWithFallback(
        () => apiFetch<OfflineSessionItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/offline`, {
          method: "POST",
          body: data,
          headers: {},
        }),
        {
          id: `offline-${Date.now()}`,
          groupId,
          type: "offline",
          title: (data.get("title") as string) ?? "Buổi học trực tiếp mới",
          status: "draft",
          order: MOCK_OFFLINE_SESSIONS.filter((o) => o.groupId === groupId).length + 1,
          createdAt: new Date().toISOString(),
          date: (data.get("date") as string) ?? new Date().toISOString().split("T")[0],
          startTime: (data.get("startTime") as string) ?? "08:00",
          endTime: (data.get("endTime") as string) ?? undefined,
          location: (data.get("location") as string) ?? undefined,
          description: (data.get("description") as string) ?? undefined,
          sessionStatus: "upcoming",
          attachments: [],
        } as OfflineSessionItem
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: OFFLINE_KEY(classId, groupId) }) },
  })
}

export function useUpdateOffline(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string; title: string; date: string; startTime: string; endTime?: string; location?: string; description?: string }) =>
      mutateWithFallback(
        () => apiFetch<OfflineSessionItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/offline/${itemId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
        {
          ...(MOCK_OFFLINE_SESSIONS.find((o) => o.id === itemId) ?? MOCK_OFFLINE_SESSIONS[0]),
          ...data,
        } as OfflineSessionItem
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: OFFLINE_KEY(classId, groupId) }) },
  })
}

export function useDeleteOffline(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) =>
      mutateWithFallback(
        () => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/offline/${itemId}`, { method: "DELETE" }),
        undefined
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: OFFLINE_KEY(classId, groupId) }) },
  })
}
