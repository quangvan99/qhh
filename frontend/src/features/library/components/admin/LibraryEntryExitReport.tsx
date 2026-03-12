'use client'

import { useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/composite'
import { StatGrid, DataTable } from '@/components/patterns'
import { AppInput } from '@/components/base'
import { DoorOpen, DoorClosed, Clock } from 'lucide-react'

interface EntryExitRow {
  id: string
  date: string
  entryCount: number
  exitCount: number
  peakHour: string
}

function generateMockData(): EntryExitRow[] {
  const data: EntryExitRow[] = []
  const baseDate = new Date('2026-02-26')
  const peakHours = ['07:30-08:30', '09:00-10:00', '13:00-14:00', '15:00-16:00']
  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + i)
    data.push({
      id: `e${i}`,
      date: d.toISOString().split('T')[0]!,
      entryCount: 120 + Math.floor(Math.random() * 80),
      exitCount: 110 + Math.floor(Math.random() * 80),
      peakHour: peakHours[Math.floor(Math.random() * peakHours.length)]!,
    })
  }
  return data
}

export function LibraryEntryExitReport() {
  const [dateFrom, setDateFrom] = useState('2026-02-26')
  const [dateTo, setDateTo] = useState('2026-03-11')
  const allData = useMemo(() => generateMockData(), [])

  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      if (dateFrom && row.date < dateFrom) return false
      if (dateTo && row.date > dateTo) return false
      return true
    })
  }, [allData, dateFrom, dateTo])

  const totalEntry = filteredData.reduce((s, r) => s + r.entryCount, 0)
  const totalExit = filteredData.reduce((s, r) => s + r.exitCount, 0)

  const columns: ColumnDef<EntryExitRow, unknown>[] = [
    {
      accessorKey: 'date',
      header: 'Ngày',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('vi-VN'),
    },
    { accessorKey: 'entryCount', header: 'Lượt vào' },
    { accessorKey: 'exitCount', header: 'Lượt ra' },
    { accessorKey: 'peakHour', header: 'Giờ cao điểm' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo ra vào thư viện"
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Báo cáo' },
          { label: 'Ra vào thư viện' },
        ]}
      />

      <div className="flex items-center gap-4">
        <AppInput label="Từ ngày" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-44" />
        <AppInput label="Đến ngày" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-44" />
      </div>

      <StatGrid
        cols={3}
        stats={[
          { title: 'Tổng lượt vào', value: totalEntry, icon: <DoorOpen className="h-5 w-5" />, module: 'library' },
          { title: 'Tổng lượt ra', value: totalExit, icon: <DoorClosed className="h-5 w-5" />, module: 'library' },
          { title: 'Trung bình/ngày', value: filteredData.length > 0 ? Math.round(totalEntry / filteredData.length) : 0, icon: <Clock className="h-5 w-5" />, module: 'library' },
        ]}
      />

      <DataTable<EntryExitRow>
        data={filteredData}
        columns={columns}
        loading={false}
        searchable
        searchPlaceholder="Tìm kiếm..."
      />
    </div>
  )
}
