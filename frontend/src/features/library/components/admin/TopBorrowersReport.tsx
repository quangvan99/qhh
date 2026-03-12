'use client'

import { useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { DataTable } from '@/components/patterns'
import { AppAvatar, AppSelect } from '@/components/base'
import { Trophy } from 'lucide-react'

interface TopBorrower {
  id: string
  rank: number
  fullName: string
  memberType: string
  borrowCount: number
  currentBorrows: number
}

const periodOptions = [
  { value: 'month', label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này' },
  { value: 'year', label: 'Năm học' },
]

const memberTypeOptions = [
  { value: '', label: 'Tất cả nhóm' },
  { value: 'student', label: 'Học sinh' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'staff', label: 'Nhân viên' },
]

const memberTypeLabel: Record<string, string> = {
  student: 'Học sinh',
  teacher: 'Giáo viên',
  staff: 'Nhân viên',
}

function generateMockData(): TopBorrower[] {
  const names = ['Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoàng Cường', 'Phạm Minh Đức', 'Hoàng Thị Em', 'Võ Văn Phúc', 'Đặng Thu Giang', 'Bùi Quang Hải', 'Ngô Thị Ích', 'Trương Văn Kiên', 'Lý Thị Lan', 'Mai Đức Mạnh', 'Phan Thị Ngọc', 'Dương Văn Ơn', 'Hà Thị Phương']
  const types = ['student', 'student', 'student', 'teacher', 'staff', 'student', 'teacher', 'student', 'staff', 'student', 'student', 'teacher', 'student', 'staff', 'student']
  return names.map((name, i) => ({
    id: `tb${i}`,
    rank: i + 1,
    fullName: name,
    memberType: types[i]!,
    borrowCount: 30 - i * 2,
    currentBorrows: Math.max(0, 3 - Math.floor(i / 5)),
  }))
}

const medalColors: Record<number, string> = {
  1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  2: 'bg-gray-100 text-gray-700 border-gray-300',
  3: 'bg-amber-100 text-amber-800 border-amber-300',
}

export function TopBorrowersReport() {
  const [period, setPeriod] = useState('month')
  const [memberType, setMemberType] = useState('')
  const allData = useMemo(() => generateMockData(), [])

  const filteredData = useMemo(() => {
    let data = allData
    if (memberType) {
      data = data.filter((r) => r.memberType === memberType)
    }
    return data.map((r, i) => ({ ...r, rank: i + 1 }))
  }, [allData, memberType])

  const columns: ColumnDef<TopBorrower, unknown>[] = [
    {
      accessorKey: 'rank',
      header: 'Hạng',
      size: 70,
      cell: ({ getValue }) => {
        const rank = getValue<number>()
        const medal = medalColors[rank]
        if (medal) {
          return (
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border font-bold text-sm ${medal}`}>
              {rank}
            </span>
          )
        }
        return <span className="inline-flex items-center justify-center w-8 h-8 text-sm text-muted-foreground">{rank}</span>
      },
    },
    {
      id: 'avatar',
      header: '',
      size: 50,
      cell: ({ row }) => (
        <AppAvatar name={row.original.fullName} size="sm" />
      ),
    },
    { accessorKey: 'fullName', header: 'Họ tên' },
    {
      accessorKey: 'memberType',
      header: 'Nhóm',
      cell: ({ getValue }) => memberTypeLabel[getValue<string>()] ?? getValue<string>(),
    },
    { accessorKey: 'borrowCount', header: 'Số lần mượn' },
    { accessorKey: 'currentBorrows', header: 'Đang mượn' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Top bạn đọc mượn nhiều nhất"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo' },
          { label: 'Top bạn đọc' },
        ]}
        actions={[
          {
            label: `${filteredData.length} bạn đọc`,
            icon: <Trophy className="h-4 w-4" />,
            variant: 'outline' as const,
          },
        ]}
      />

      <div className="flex items-center gap-4">
        <div className="w-48">
          <AppSelect options={periodOptions} value={period} onChange={setPeriod} placeholder="Kỳ" />
        </div>
        <div className="w-48">
          <AppSelect options={memberTypeOptions} value={memberType} onChange={setMemberType} placeholder="Nhóm bạn đọc" />
        </div>
      </div>

      <DataTable<TopBorrower>
        data={filteredData}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm bạn đọc..."
      />
    </div>
  )
}
