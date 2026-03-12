import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Question, QuestionCategory, QuestionType, Difficulty, QuestionOption, RubricItem } from '../types'
import type { PaginatedResponse, ApiResponse } from '@/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makePaginated<T>(data: T[]): PaginatedResponse<T> {
  return {
    data,
    pagination: { page: 1, pageSize: data.length, total: data.length, totalPages: 1 },
  }
}

function makeApiResponse<T>(data: T): ApiResponse<T> {
  return { data, success: true }
}

// ── Mock Categories ───────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: QuestionCategory[] = [
  {
    id: 'cat-toan', name: 'Toán học',
    children: [
      { id: 'cat-toan-ds', name: 'Đại số', parentId: 'cat-toan' },
      { id: 'cat-toan-gt', name: 'Giải tích', parentId: 'cat-toan' },
      { id: 'cat-toan-hh', name: 'Hình học', parentId: 'cat-toan' },
      { id: 'cat-toan-xs', name: 'Xác suất - Thống kê', parentId: 'cat-toan' },
      { id: 'cat-toan-ts', name: 'Tổ hợp', parentId: 'cat-toan' },
    ],
  },
  {
    id: 'cat-ly', name: 'Vật lý',
    children: [
      { id: 'cat-ly-co', name: 'Cơ học', parentId: 'cat-ly' },
      { id: 'cat-ly-nhiet', name: 'Nhiệt học', parentId: 'cat-ly' },
      { id: 'cat-ly-dien', name: 'Điện học', parentId: 'cat-ly' },
      { id: 'cat-ly-quang', name: 'Quang học', parentId: 'cat-ly' },
      { id: 'cat-ly-ht', name: 'Hạt nhân – Nguyên tử', parentId: 'cat-ly' },
    ],
  },
  {
    id: 'cat-hoa', name: 'Hóa học',
    children: [
      { id: 'cat-hoa-vc', name: 'Hóa vô cơ', parentId: 'cat-hoa' },
      { id: 'cat-hoa-hc', name: 'Hóa hữu cơ', parentId: 'cat-hoa' },
      { id: 'cat-hoa-dl', name: 'Đại cương', parentId: 'cat-hoa' },
      { id: 'cat-hoa-pp', name: 'Phân tích hóa học', parentId: 'cat-hoa' },
    ],
  },
  {
    id: 'cat-van', name: 'Ngữ văn',
    children: [
      { id: 'cat-van-vb', name: 'Văn bản', parentId: 'cat-van' },
      { id: 'cat-van-lv', name: 'Làm văn', parentId: 'cat-van' },
      { id: 'cat-van-tv', name: 'Tiếng Việt', parentId: 'cat-van' },
      { id: 'cat-van-vhs', name: 'Văn học sử', parentId: 'cat-van' },
    ],
  },
  {
    id: 'cat-anh', name: 'Tiếng Anh',
    children: [
      { id: 'cat-anh-ng', name: 'Ngữ pháp', parentId: 'cat-anh' },
      { id: 'cat-anh-tv', name: 'Từ vựng', parentId: 'cat-anh' },
      { id: 'cat-anh-doc', name: 'Đọc hiểu', parentId: 'cat-anh' },
      { id: 'cat-anh-viet', name: 'Viết', parentId: 'cat-anh' },
      { id: 'cat-anh-nghe', name: 'Nghe', parentId: 'cat-anh' },
    ],
  },
  {
    id: 'cat-su', name: 'Lịch sử',
    children: [
      { id: 'cat-su-vn', name: 'Lịch sử Việt Nam', parentId: 'cat-su' },
      { id: 'cat-su-tg', name: 'Lịch sử Thế giới', parentId: 'cat-su' },
    ],
  },
  {
    id: 'cat-dia', name: 'Địa lý',
    children: [
      { id: 'cat-dia-tn', name: 'Địa lý tự nhiên', parentId: 'cat-dia' },
      { id: 'cat-dia-ktvn', name: 'Địa lý KT-XH Việt Nam', parentId: 'cat-dia' },
      { id: 'cat-dia-tg', name: 'Địa lý Thế giới', parentId: 'cat-dia' },
    ],
  },
  {
    id: 'cat-sinh', name: 'Sinh học',
    children: [
      { id: 'cat-sinh-tb', name: 'Tế bào học', parentId: 'cat-sinh' },
      { id: 'cat-sinh-dt', name: 'Di truyền học', parentId: 'cat-sinh' },
      { id: 'cat-sinh-st', name: 'Sinh thái học', parentId: 'cat-sinh' },
      { id: 'cat-sinh-cth', name: 'Cơ thể học', parentId: 'cat-sinh' },
    ],
  },
  { id: 'cat-gdcd', name: 'GDCD' },
  { id: 'cat-tin', name: 'Tin học' },
]

// ── Mock Questions ────────────────────────────────────────────────────────────

const ALL_CAT_IDS = [
  'cat-toan', 'cat-ly', 'cat-hoa', 'cat-van', 'cat-anh',
  'cat-su', 'cat-dia', 'cat-sinh', 'cat-gdcd', 'cat-tin',
]
const ALL_CAT_NAMES = [
  'Toán học', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh',
  'Lịch sử', 'Địa lý', 'Sinh học', 'GDCD', 'Tin học',
]
const ALL_AUTHORS = ['GV. Nguyễn Văn A', 'GV. Trần Thị B', 'GV. Lê Hoàng C', 'GV. Phạm Thu D', 'GV. Hoàng Minh E']
const ALL_DIFFS: Difficulty[] = ['easy', 'medium', 'hard', 'very_hard']

const MCQ_CONTENTS = [
  'Bào quan nào được gọi là "nhà máy năng lượng" của tế bào động vật?',
  'Công thức hóa học của nước là gì?',
  'Ai là người phát minh ra 3 định luật về chuyển động?',
  'Axit nucleic nào mang thông tin di truyền trong tế bào?',
  'Quá trình tổng hợp chất hữu cơ từ CO₂ và H₂O nhờ ánh sáng gọi là gì?',
  'Đại lượng vật lý có cả độ lớn và hướng gọi là đại lượng gì?',
  'Hạt mang điện tích âm trong nguyên tử là hạt nào?',
  'Nguyên tố nào chiếm tỉ lệ khoảng 21% trong không khí?',
  'Nguyên tố nào là thành phần chính cấu tạo nên kim cương?',
  'Chất nào là thành phần chủ yếu cấu tạo nên enzyme?',
  'Đơn vị đo cường độ dòng điện trong hệ SI là gì?',
  'Phản ứng nào giải phóng năng lượng ATP trong tế bào sống?',
  'Định luật nào phát biểu: "Lực hút giữa hai vật tỉ lệ với tích khối lượng"?',
  'Tốc độ ánh sáng trong chân không xấp xỉ bao nhiêu km/s?',
  'Nguyên tố nào có số hiệu nguyên tử là 1?',
  'Số electron ở lớp ngoài cùng của nguyên tử natri (Na) là bao nhiêu?',
  'Phương trình tổng quát của phản ứng quang hợp là gì?',
  'Dung dịch có pH = 7 ở 25°C là loại dung dịch gì?',
  'Trong toán học, giá trị của sin(90°) bằng bao nhiêu?',
  'Diện tích hình tròn bán kính r được tính theo công thức nào?',
  'Căn bậc hai của 144 bằng bao nhiêu?',
  'Số π xấp xỉ bằng bao nhiêu (đến 2 chữ số thập phân)?',
  'Công thức tính vận tốc trung bình là gì?',
  'Đơn vị đo điện trở trong hệ SI là gì?',
  'Chu kỳ bán rã của Carbon-14 là khoảng bao nhiêu năm?',
  'Số mol của 18 gam nước (H₂O) ở điều kiện chuẩn là bao nhiêu?',
  'Khí nào chiếm tỉ lệ lớn nhất trong thành phần không khí?',
  'Áp suất được tính theo công thức nào?',
  'Nhiệt độ sôi của nước ở áp suất 1 atm là bao nhiêu độ Celsius?',
  'Nguyên tố hóa học nào có ký hiệu là Fe?',
  'Tổng số đo các góc trong của một tam giác bằng bao nhiêu độ?',
  'Đơn vị tiền tệ quốc gia nào có ký hiệu VND?',
  'Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là thành phố nào?',
  'Sông nào có chiều dài lớn nhất trên lãnh thổ Việt Nam?',
  'Chiến thắng Điện Biên Phủ lịch sử xảy ra vào năm nào?',
  'Việt Nam chính thức thống nhất đất nước vào năm nào?',
  'Ai là Chủ tịch nước đầu tiên của nước Việt Nam Dân chủ Cộng hòa?',
  'Bán đảo nào được coi là lớn nhất trên thế giới?',
  'Đại dương nào có diện tích lớn nhất trên Trái Đất?',
  'Dãy núi nào được coi là cao nhất và dài nhất thế giới?',
]

const MCQ_OPTIONS_A = ['Mitochondria', 'H₂O', 'Newton', 'DNA', 'Quang hợp', 'Vecto', 'Electron', 'Oxi', 'Carbon', 'Protein', 'Ampe (A)', 'Hô hấp tế bào', 'Newton', '300.000', 'Hydro', '1', '6CO₂+6H₂O→C₆H₁₂O₆+6O₂', 'Trung tính', '1', 'πr²', '12', '3,14', 'v=s/t', 'Ohm (Ω)', '5.730', '1 mol', 'Nitơ (N₂)', 'P=F/S', '100°C', 'Sắt', '180°', 'Việt Nam', 'Hà Nội', 'Sông Đà', '1954', '1975', 'Hồ Chí Minh', 'Ả Rập', 'Thái Bình Dương', 'Himalaya']
const MCQ_OPTIONS_B = ['Ribosome', 'CO₂', 'Einstein', 'RNA', 'Hô hấp', 'Số vô hướng', 'Proton', 'Nitơ', 'Silicon', 'Lipid', 'Vôn (V)', 'Quang hợp', 'Einstein', '200.000', 'Helium', '2', '6CO₂+6H₂O→6O₂+C₆H₁₂O₆', 'Axit', '0', '2πr²', '11', '3,16', 'v=F/m', 'Watt (W)', '3.730', '2 mol', 'Oxi (O₂)', 'P=m*g', '0°C', 'Vàng', '360°', 'Mỹ', 'TP. Hồ Chí Minh', 'Sông Hồng', '1945', '1976', 'Nguyễn Ái Quốc', 'Scandinavia', 'Đại Tây Dương', 'Andes']
const MCQ_OPTIONS_C = ['Nucleus', 'O₂', 'Galileo', 'mRNA', 'Hấp thụ', 'Ma trận', 'Neutron', 'Heli', 'Sắt', 'Glucid', 'Culông (C)', 'Phân bào', 'Leibniz', '150.000', 'Carbon', '8', 'CO₂+H₂O→C₆H₁₂O₆', 'Bazơ', '√2/2', '4r²', '14', '3,41', 'v=at', 'Joule (J)', '7.300', '0,5 mol', 'CO₂', 'P=ρgh', '37°C', 'Nhôm', '270°', 'Anh', 'Đà Nẵng', 'Sông Mekong', '1975', '1969', 'Võ Nguyên Giáp', 'Iberia', 'Ấn Độ Dương', 'Alps']
const MCQ_OPTIONS_D = ['Golgi', 'NaCl', 'Copernicus', 'tRNA', 'Trao đổi chất', 'Tích phân', 'Photon', 'Neon', 'Đồng', 'Vitamin', 'Tesla (T)', 'Nguyên phân', 'Mendel', '100.000', 'Oxy', '4', 'Chỉ xảy ra vào ban đêm', 'Không xác định', '√3/2', 'πd²', '10', '3,12', 'v=m/a', 'Pascal (Pa)', '1.730', '3 mol', 'Argon (Ar)', 'P=F*d', '50°C', 'Đồng', '90°', 'Pháp', 'Huế', 'Sông Cửu Long', '1973', '1972', 'Trường Chinh', 'Indochina', 'Bắc Băng Dương', 'Rockies']

function buildMcqOptions(i: number, type: QuestionType): QuestionOption[] | undefined {
  if (type !== 'single_choice' && type !== 'multi_choice' && type !== 'true_false') return undefined
  if (type === 'true_false') {
    return [
      { id: `q${i}-t`, content: 'Đúng', isCorrect: i % 2 === 0, order: 0 },
      { id: `q${i}-f`, content: 'Sai', isCorrect: i % 2 !== 0, order: 1 },
    ]
  }
  const correctIdx = i % 4 // A=0,B=1,C=2,D=3
  const isMulti = type === 'multi_choice'
  return [
    { id: `q${i}-a`, content: MCQ_OPTIONS_A[i % MCQ_OPTIONS_A.length] ?? 'Đáp án A', isCorrect: correctIdx === 0 || (isMulti && i % 3 === 0), order: 0 },
    { id: `q${i}-b`, content: MCQ_OPTIONS_B[i % MCQ_OPTIONS_B.length] ?? 'Đáp án B', isCorrect: correctIdx === 1, order: 1 },
    { id: `q${i}-c`, content: MCQ_OPTIONS_C[i % MCQ_OPTIONS_C.length] ?? 'Đáp án C', isCorrect: correctIdx === 2, order: 2 },
    { id: `q${i}-d`, content: MCQ_OPTIONS_D[i % MCQ_OPTIONS_D.length] ?? 'Đáp án D', isCorrect: correctIdx === 3, order: 3 },
  ]
}

const ESSAY_CONTENTS = [
  'Phân tích vai trò của nhân vật Mị trong tác phẩm "Vợ chồng A Phủ" của Tô Hoài. Liên hệ với thực tiễn xã hội đương thời.',
  'Trình bày nguyên nhân, diễn biến và ý nghĩa lịch sử của Cách mạng tháng Tám năm 1945.',
  'Giải thích quá trình quang hợp ở thực vật xanh. Nêu rõ vai trò của quang hợp đối với sự sống trên Trái Đất.',
  'Phân tích ý nghĩa của ba định luật Newton trong đời sống hàng ngày. Lấy ví dụ minh họa cho từng định luật.',
  'Trình bày cấu trúc và chức năng của tế bào nhân thực. So sánh tế bào nhân thực với tế bào nhân sơ.',
  'Phân tích bài thơ "Tây Tiến" của Quang Dũng. Cảm nhận về hình tượng người lính Tây Tiến.',
  'Chứng minh rằng √2 là số vô tỉ. Trình bày đầy đủ và chặt chẽ các bước chứng minh.',
  'Giải thích nguyên lý phân li độc lập của Mendel. Nêu ý nghĩa di truyền của quy luật này.',
  'Phân tích các nhân tố ảnh hưởng đến tốc độ phản ứng hóa học. Lấy ví dụ từ thực tiễn.',
  'Trình bày nguyên lý hoạt động của động cơ điện một chiều. Ứng dụng trong công nghiệp hiện đại.',
  'Phân tích thực trạng ô nhiễm môi trường tại Việt Nam và đề xuất các giải pháp khắc phục hiệu quả.',
  'Viết đoạn văn nghị luận (khoảng 600 chữ) về vai trò của việc đọc sách trong thời đại số.',
  'Phân tích tác động của cuộc Cách mạng công nghiệp 4.0 đến nền kinh tế và xã hội Việt Nam.',
  'Trình bày quá trình hình thành và phát triển của Nhà nước Văn Lang – Âu Lạc trong lịch sử Việt Nam.',
  'Giải thích tại sao bầu trời có màu xanh vào ban ngày. Trình bày cơ chế tán xạ Rayleigh.',
]

const FILL_BLANK_CONTENTS = [
  'Điền vào chỗ trống: Công thức tính diện tích hình tròn bán kính r là ______.',
  'Điền vào chỗ trống: Định lý Pythagore phát biểu rằng trong tam giác vuông: ______.',
  'Điền vào chỗ trống: Nguyên tố hóa học có số hiệu nguyên tử 1 là ______ (ký hiệu: H).',
  'Điền vào chỗ trống: Tốc độ ánh sáng trong chân không là khoảng ______ km/s.',
  'Điền vào chỗ trống: Đơn vị đo lực trong hệ SI là ______ (ký hiệu: N).',
  'Điền vào chỗ trống: Công thức tính vận tốc là v = ______.',
  'Điền vào chỗ trống: Dung dịch có pH < 7 được gọi là dung dịch ______.',
  'Điền vào chỗ trống: Phương trình bậc hai ax² + bx + c = 0 có nghiệm khi Δ = ______ ≥ 0.',
  'Điền vào chỗ trống: Chiến thắng Điện Biên Phủ xảy ra vào năm ______.',
  'Điền vào chỗ trống: Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là ______.',
]

const MOCK_QUESTIONS: Question[] = [
  // 40 single_choice
  ...Array.from({ length: 40 }, (_, i): Question => ({
    id: `q-sc-${i}`,
    type: 'single_choice',
    categoryId: ALL_CAT_IDS[i % ALL_CAT_IDS.length]!,
    categoryName: ALL_CAT_NAMES[i % ALL_CAT_NAMES.length],
    difficulty: ALL_DIFFS[i % ALL_DIFFS.length]!,
    content: MCQ_CONTENTS[i % MCQ_CONTENTS.length]!,
    options: buildMcqOptions(i, 'single_choice'),
    explanation: `Giải thích câu ${i + 1}: Đáp án đúng là ${['A', 'B', 'C', 'D'][i % 4]} vì đây là kiến thức cơ bản trong chương trình.`,
    tags: [ALL_CAT_NAMES[i % ALL_CAT_NAMES.length]?.toLowerCase() ?? '', ALL_DIFFS[i % ALL_DIFFS.length]!, `chủ đề ${(i % 8) + 1}`],
    authorId: `u-${(i % 5) + 1}`,
    authorName: ALL_AUTHORS[i % ALL_AUTHORS.length],
    createdAt: `2026-0${Math.min(9, (i % 9) + 1)}-${String(Math.min(28, (i % 20) + 1)).padStart(2, '0')}`,
    updatedAt: `2026-03-${String(Math.min(28, (i % 20) + 5)).padStart(2, '0')}`,
  })),
  // 8 multi_choice
  ...Array.from({ length: 8 }, (_, i): Question => ({
    id: `q-mc-${i}`,
    type: 'multi_choice',
    categoryId: ALL_CAT_IDS[(i + 2) % ALL_CAT_IDS.length]!,
    categoryName: ALL_CAT_NAMES[(i + 2) % ALL_CAT_NAMES.length],
    difficulty: ALL_DIFFS[(i + 1) % ALL_DIFFS.length]!,
    content: `(Nhiều đáp án đúng) ${MCQ_CONTENTS[(i + 5) % MCQ_CONTENTS.length]!}`,
    options: buildMcqOptions(i + 40, 'multi_choice'),
    explanation: `Giải thích câu nhiều lựa chọn ${i + 1}: Có thể có nhiều đáp án đúng.`,
    tags: ['nhiều lựa chọn', ALL_CAT_NAMES[(i + 2) % ALL_CAT_NAMES.length]?.toLowerCase() ?? ''],
    authorId: `u-${(i % 5) + 1}`,
    authorName: ALL_AUTHORS[i % ALL_AUTHORS.length],
    createdAt: `2026-01-${String(Math.min(28, i + 1)).padStart(2, '0')}`,
    updatedAt: `2026-03-${String(Math.min(28, i + 2)).padStart(2, '0')}`,
  })),
  // 5 true_false
  ...Array.from({ length: 5 }, (_, i): Question => ({
    id: `q-tf-${i}`,
    type: 'true_false',
    categoryId: ALL_CAT_IDS[(i + 3) % ALL_CAT_IDS.length]!,
    categoryName: ALL_CAT_NAMES[(i + 3) % ALL_CAT_NAMES.length],
    difficulty: ALL_DIFFS[i % 2 === 0 ? 0 : 1]!,
    content: `Nhận định sau là Đúng hay Sai: ${MCQ_CONTENTS[(i + 10) % MCQ_CONTENTS.length]}`,
    options: buildMcqOptions(i + 48, 'true_false'),
    explanation: `Nhận định ${i % 2 === 0 ? 'đúng' : 'sai'} vì...`,
    tags: ['đúng/sai', ALL_CAT_NAMES[(i + 3) % ALL_CAT_NAMES.length]?.toLowerCase() ?? ''],
    authorId: `u-${(i % 5) + 1}`,
    authorName: ALL_AUTHORS[i % ALL_AUTHORS.length],
    createdAt: `2026-02-${String(Math.min(28, i + 1)).padStart(2, '0')}`,
    updatedAt: `2026-03-01`,
  })),
  // 15 essay
  ...Array.from({ length: 15 }, (_, i): Question => ({
    id: `q-essay-${i}`,
    type: 'essay',
    categoryId: ALL_CAT_IDS[i % ALL_CAT_IDS.length]!,
    categoryName: ALL_CAT_NAMES[i % ALL_CAT_NAMES.length],
    difficulty: ALL_DIFFS[(i + 2) % ALL_DIFFS.length]!,
    content: ESSAY_CONTENTS[i % ESSAY_CONTENTS.length]!,
    maxScore: [3, 4, 5, 6, 10][i % 5],
    suggestedAnswer: `Gợi ý trả lời cho câu ${i + 1}: Học sinh cần phân tích rõ ràng, có dẫn chứng cụ thể, lập luận logic và liên hệ thực tiễn.`,
    rubric: [
      { id: `rb-${i}-1`, criterion: 'Nội dung', maxScore: [2, 3, 3, 4, 6][i % 5]!, description: 'Đầy đủ, chính xác, sâu sắc, có dẫn chứng' },
      { id: `rb-${i}-2`, criterion: 'Trình bày', maxScore: [0.5, 0.5, 1, 1, 2][i % 5]!, description: 'Rõ ràng, mạch lạc, đúng chính tả, đúng ngữ pháp' },
      { id: `rb-${i}-3`, criterion: 'Sáng tạo', maxScore: [0.5, 0.5, 1, 1, 2][i % 5]!, description: 'Liên hệ thực tiễn, có ví dụ hay, quan điểm riêng' },
    ] as RubricItem[],
    tags: ['tự luận', ALL_CAT_NAMES[i % ALL_CAT_NAMES.length]?.toLowerCase() ?? '', ALL_DIFFS[(i + 2) % ALL_DIFFS.length]!],
    authorId: `u-${(i % 5) + 1}`,
    authorName: ALL_AUTHORS[i % ALL_AUTHORS.length],
    createdAt: `2026-0${Math.min(9, (i % 6) + 1)}-${String(Math.min(28, i + 1)).padStart(2, '0')}`,
    updatedAt: `2026-03-${String(Math.min(28, i + 3)).padStart(2, '0')}`,
  })),
  // 10 fill_blank
  ...Array.from({ length: 10 }, (_, i): Question => ({
    id: `q-fill-${i}`,
    type: 'fill_blank',
    categoryId: ALL_CAT_IDS[i % ALL_CAT_IDS.length]!,
    categoryName: ALL_CAT_NAMES[i % ALL_CAT_NAMES.length],
    difficulty: ALL_DIFFS[i % ALL_DIFFS.length]!,
    content: FILL_BLANK_CONTENTS[i % FILL_BLANK_CONTENTS.length]!,
    explanation: `Đáp án điền vào chỗ trống câu ${i + 1}.`,
    tags: ['điền khuyết', ALL_CAT_NAMES[i % ALL_CAT_NAMES.length]?.toLowerCase() ?? ''],
    authorId: `u-${(i % 5) + 1}`,
    authorName: ALL_AUTHORS[i % ALL_AUTHORS.length],
    createdAt: `2026-02-${String(Math.min(28, i + 1)).padStart(2, '0')}`,
    updatedAt: `2026-03-${String(Math.min(28, i + 2)).padStart(2, '0')}`,
  })),
]

// ── Query Keys ──────────────────────────────────────────────────────────────

const keys = {
  all: ['exam', 'questions'] as const,
  list: (params?: object) => ['exam', 'questions', 'list', params] as const,
  detail: (id: string) => ['exam', 'questions', id] as const,
  categories: ['exam', 'categories'] as const,
  stats: ['exam', 'question-stats'] as const,
}

// ── Fetch Functions ──────────────────────────────────────────────────────────

async function fetchQuestions(params?: {
  type?: string
  difficulty?: string
  categoryId?: string
  q?: string
  subject?: string
}): Promise<PaginatedResponse<Question>> {
  try {
    return await apiFetch<PaginatedResponse<Question>>(
      `/api/exam/questions?${new URLSearchParams((params ?? {}) as Record<string, string>).toString()}`
    )
  } catch {
    let data = [...MOCK_QUESTIONS]
    if (params?.q) {
      const q = params.q.toLowerCase()
      data = data.filter((q_) =>
        q_.content.toLowerCase().includes(q) ||
        q_.categoryName?.toLowerCase().includes(q) ||
        q_.tags.some((t) => t.includes(q))
      )
    }
    if (params?.type) data = data.filter((q_) => q_.type === params.type)
    if (params?.difficulty) data = data.filter((q_) => q_.difficulty === params.difficulty)
    if (params?.categoryId) data = data.filter((q_) => q_.categoryId === params.categoryId || q_.categoryId?.startsWith(params.categoryId!))
    if (params?.subject) data = data.filter((q_) => q_.categoryName?.toLowerCase().includes(params.subject!.toLowerCase()))
    return makePaginated(data)
  }
}

async function fetchQuestion(id: string): Promise<ApiResponse<Question>> {
  try {
    return await apiFetch<ApiResponse<Question>>(`/api/exam/questions/${id}`)
  } catch {
    const found = MOCK_QUESTIONS.find((q) => q.id === id) ?? MOCK_QUESTIONS[0]!
    return makeApiResponse(found)
  }
}

// ── List & Detail Hooks ──────────────────────────────────────────────────────

export function useGetQuestions(params?: {
  type?: string
  difficulty?: string
  categoryId?: string
  q?: string
  subject?: string
}) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => fetchQuestions(params),
  })
}

export function useGetQuestion(id: string) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => fetchQuestion(id),
    enabled: !!id,
  })
}

export function useGetCategories() {
  return useQuery({
    queryKey: keys.categories,
    queryFn: async () => {
      try {
        return await apiFetch<ApiResponse<QuestionCategory[]>>('/api/exam/categories')
      } catch {
        return makeApiResponse(MOCK_CATEGORIES)
      }
    },
  })
}

export function useGetQuestionStats() {
  return useQuery({
    queryKey: keys.stats,
    queryFn: async () => {
      try {
        return await apiFetch<ApiResponse<{
          total: number
          byType: Record<string, number>
          byDifficulty: Record<string, number>
          byCategory: { id: string; name: string; count: number }[]
        }>>('/api/exam/questions/stats')
      } catch {
        return makeApiResponse({
          total: MOCK_QUESTIONS.length,
          byType: {
            single_choice: 40,
            multi_choice: 8,
            essay: 15,
            true_false: 5,
            fill_blank: 10,
          },
          byDifficulty: {
            easy: 20,
            medium: 24,
            hard: 20,
            very_hard: 14,
          },
          byCategory: MOCK_CATEGORIES.map((c, i) => ({
            id: c.id,
            name: c.name,
            count: 5 + (i % 8) * 3,
          })),
        })
      }
    },
  })
}

// ── Mutation Hooks ───────────────────────────────────────────────────────────

export function useCreateQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Question>) =>
      apiFetch<ApiResponse<Question>>('/api/exam/questions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.all }) },
  })
}

export function useUpdateQuestion(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Question>) =>
      apiFetch<ApiResponse<Question>>(`/api/exam/questions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
      qc.invalidateQueries({ queryKey: keys.detail(id) })
    },
  })
}

export function useDeleteQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (questionId: string) =>
      apiFetch<ApiResponse<void>>(`/api/exam/questions/${questionId}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.all }) },
  })
}

export function useBulkDeleteQuestions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) =>
      apiFetch<ApiResponse<void>>('/api/exam/questions/bulk', {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.all }) },
  })
}

export function useCopyQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (questionId: string) =>
      apiFetch<ApiResponse<Question>>(`/api/exam/questions/${questionId}/copy`, { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.all }) },
  })
}

export function useImportQuestionsFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<ApiResponse<{ success: number; failed: number; errors: string[] }>>(
        '/api/exam/questions/import-file',
        { method: 'POST', body: formData, headers: {} }
      ),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.all }) },
  })
}

export function useExportQuestions() {
  return useMutation({
    mutationFn: (data: {
      questionIds: string[]
      format: 'excel' | 'word' | 'pdf'
      includeAnswers: boolean
      sort: string
    }) =>
      apiFetch<Blob>('/api/exam/questions/export', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}

export function useBulkMoveCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { questionIds: string[]; targetCategoryId: string }) =>
      apiFetch<ApiResponse<void>>('/api/exam/questions/bulk-move', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.all }) },
  })
}

// ── Category CRUD ────────────────────────────────────────────────────────────

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; parentId?: string }) =>
      apiFetch<ApiResponse<QuestionCategory>>('/api/exam/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.categories }) },
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name: string; parentId?: string }) =>
      apiFetch<ApiResponse<QuestionCategory>>(`/api/exam/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.categories }) },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ApiResponse<void>>(`/api/exam/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: keys.categories }) },
  })
}
