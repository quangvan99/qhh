'use client'

import { useQuery } from '@tanstack/react-query'
import { studentMockApi } from '@/lib/mock'
import { useState } from 'react'
import { ChevronDown, ChevronUp, LogOut, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Mock student profile
const STUDENT_PROFILE = {
  name: 'Nguyễn Văn Minh',
  class: '12A1',
  code: 'HS-001',
  dob: '01/09/2007',
  phone: '0912345678',
  email: 'hs001@quochoc.edu.vn',
  address: '12 Lê Lợi, Huế',
  conduct: {
    total: 92,
    max: 100,
    label: 'Tốt',
    breakdown: [
      { label: 'Học tập', score: 38, max: 40 },
      { label: 'Kỷ luật', score: 25, max: 25 },
      { label: 'Hoạt động', score: 20, max: 25 },
      { label: 'Vệ sinh', score: 9, max: 10 },
    ]
  },
  scholarships: [
    { name: 'Học bổng HK1 2024-2025', amount: '2.000.000 đ', type: 'Loại 1', date: '12/2024' },
  ],
  achievements: [
    { id: 'a1', icon: '🏅', label: 'HSG Tỉnh Toán', unlocked: true },
    { id: 'a2', icon: '🥈', label: 'HKPĐ', unlocked: true },
    { id: 'a3', icon: '📚', label: 'Đọc 10 sách', unlocked: true },
    { id: 'a4', icon: '✅', label: 'Chuyên cần 30 ngày', unlocked: true },
    { id: 'a5', icon: '🔒', label: 'Đạt GPA 9.0', unlocked: false },
    { id: 'a6', icon: '🔒', label: 'Top 3 lớp', unlocked: false },
  ]
}

function Section({
  title, emoji, defaultOpen = false, children,
}: {
  title: string; emoji: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl bg-card border shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center gap-2 px-4 py-3.5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base">{emoji}</span>
        <span className="flex-1 font-semibold text-sm">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="border-t px-4 py-4">{children}</div>}
    </div>
  )
}

function MobileSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-4">
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      <div className="h-16 animate-pulse rounded-xl bg-muted" />
      {Array(4).fill(0).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />)}
    </div>
  )
}

export default function HoSoPage() {
  const { data: results, isLoading } = useQuery({
    queryKey: ['hs', 'results', 'hs-001'],
    queryFn: () => studentMockApi.getMyResults('hs-001'),
  })

  if (isLoading) return <MobileSkeleton />

  const { conduct } = STUDENT_PROFILE
  const conductGrade = conduct.total >= 90 ? { label: 'Xuất sắc', color: 'bg-emerald-100 text-emerald-700' } :
    conduct.total >= 80 ? { label: 'Tốt', color: 'bg-green-100 text-green-700' } :
    conduct.total >= 65 ? { label: 'Khá', color: 'bg-blue-100 text-blue-700' } :
    { label: 'TB', color: 'bg-orange-100 text-orange-700' }

  return (
    <div className="mx-auto max-w-lg pb-24">
      {/* Header profile */}
      <div className="px-4 pt-6 pb-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-3 shadow-lg">
          <span className="text-primary-foreground font-black text-2xl">NM</span>
        </div>
        <h1 className="text-xl font-bold">{STUDENT_PROFILE.name}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Lớp {STUDENT_PROFILE.class} · Mã HS: {STUDENT_PROFILE.code}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
          onClick={() => toast.info('Đã đăng xuất (mock)')}
        >
          <LogOut className="h-3.5 w-3.5" />
          Đăng xuất
        </Button>
      </div>

      {/* Stats row */}
      {results && (
        <div className="px-4 mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-card border p-3 text-center shadow-sm">
            <p className="text-xl font-black text-primary">{results.gpa}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">GPA</p>
          </div>
          <div className="rounded-xl bg-card border p-3 text-center shadow-sm">
            <p className="text-xl font-black text-primary">{conduct.total}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">ĐRL</p>
          </div>
          <div className="rounded-xl bg-card border p-3 text-center shadow-sm">
            <p className="text-xl font-black text-primary">{results.rank}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Hạng/{results.totalStudents}</p>
          </div>
        </div>
      )}

      {/* Accordion sections */}
      <div className="px-4 space-y-3">
        {/* Thông tin cá nhân */}
        <Section title="Thông tin cá nhân" emoji="📋" defaultOpen>
          <div className="space-y-3">
            {[
              { label: 'Ngày sinh', value: STUDENT_PROFILE.dob },
              { label: 'Số điện thoại', value: STUDENT_PROFILE.phone },
              { label: 'Email', value: STUDENT_PROFILE.email },
              { label: 'Địa chỉ', value: STUDENT_PROFILE.address },
            ].map(item => (
              <div key={item.label} className="flex items-start justify-between gap-4">
                <span className="text-sm text-muted-foreground shrink-0">{item.label}</span>
                <span className="text-sm font-medium text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Điểm rèn luyện */}
        <Section title="Điểm rèn luyện" emoji="🏆">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-black text-primary">{conduct.total}</p>
              <p className="text-xs text-muted-foreground">/{conduct.max} điểm</p>
            </div>
            <div className="flex-1">
              <Badge className={cn('mb-2', conductGrade.color)}>{conductGrade.label}</Badge>
              <Progress value={(conduct.total / conduct.max) * 100} className="h-2" />
            </div>
          </div>
          <div className="space-y-3">
            {conduct.breakdown.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold">{item.score}/{item.max}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', item.score === item.max ? 'bg-green-500' : item.score / item.max >= 0.8 ? 'bg-blue-500' : 'bg-amber-500')}
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Học bổng */}
        <Section title="Học bổng" emoji="💰">
          {STUDENT_PROFILE.scholarships.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Chưa có học bổng</p>
          ) : (
            <div className="space-y-3">
              {STUDENT_PROFILE.scholarships.map((s, i) => (
                <div key={i} className="rounded-xl bg-yellow-50 border border-yellow-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-yellow-700">{s.amount}</p>
                      <Badge className="bg-yellow-100 text-yellow-800 text-[10px] mt-0.5">{s.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => toast.info('Tải xuống danh sách học bổng...')}
              >
                <Download className="h-3.5 w-3.5" /> Tải xuống
              </Button>
            </div>
          )}
        </Section>

        {/* Thành tích */}
        <Section title="Thành tích & Huy hiệu" emoji="🎖️">
          <div className="grid grid-cols-3 gap-3">
            {STUDENT_PROFILE.achievements.map(ach => (
              <div
                key={ach.id}
                className={cn(
                  'rounded-xl border p-3 text-center transition-all',
                  ach.unlocked ? 'bg-card' : 'bg-muted/30 opacity-50 grayscale'
                )}
              >
                <span className="text-2xl block mb-1.5">{ach.icon}</span>
                <p className="text-[10px] font-medium leading-tight">{ach.label}</p>
                {ach.unlocked ? (
                  <div className="mt-1.5 h-1 w-full rounded-full bg-primary/30">
                    <div className="h-full w-full rounded-full bg-primary" />
                  </div>
                ) : (
                  <p className="text-[9px] text-muted-foreground mt-1">Chưa mở khóa</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
