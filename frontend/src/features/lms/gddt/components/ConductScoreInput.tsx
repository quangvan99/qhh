'use client'

import { useState, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader } from '@/components/composite/page-header'
import { useGetStudentConductScores, useSaveStudentConductScores } from '../api/gddt.api'
import type { ConductScore } from '../types/gddt.types'
import { toast } from 'sonner'

function getClassification(total: number): { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' } {
  if (total >= 90) return { label: 'Xuất sắc', variant: 'default' }
  if (total >= 80) return { label: 'Tốt', variant: 'default' }
  if (total >= 65) return { label: 'Khá', variant: 'secondary' }
  if (total >= 50) return { label: 'Trung bình', variant: 'outline' }
  return { label: 'Yếu', variant: 'destructive' }
}

export function ConductScoreInput() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.studentId as string

  const [term, setTerm] = useState('HK1')
  const [year] = useState(() => {
    const y = new Date().getFullYear()
    return `${y}-${y + 1}`
  })

  const { data, isLoading } = useGetStudentConductScores(studentId, term, year)
  const saveMutation = useSaveStudentConductScores()

  const [localScores, setLocalScores] = useState<Record<string, number>>({})
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({})
  const [comment, setComment] = useState('')

  // Sync loaded data
  const scores: ConductScore[] = data?.scores ?? []

  const handleScoreChange = useCallback((criteriaId: string, value: number, maxScore: number) => {
    const clamped = Math.max(0, Math.min(value, maxScore))
    setLocalScores((prev) => ({ ...prev, [criteriaId]: clamped }))
  }, [])

  const handleNoteChange = useCallback((criteriaId: string, value: string) => {
    setLocalNotes((prev) => ({ ...prev, [criteriaId]: value }))
  }, [])

  const getScore = (s: ConductScore) => localScores[s.criteriaId] ?? s.score

  const totalScore = useMemo(() => {
    return scores.reduce((sum, s) => sum + getScore(s), 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scores, localScores])

  const classification = getClassification(totalScore)

  // Group by criteria group
  const grouped = useMemo(() => {
    const groups: Record<string, ConductScore[]> = {}
    for (const s of scores) {
      const key = s.criteriaGroup
      if (!groups[key]) groups[key] = []
      groups[key]!.push(s)
    }
    return groups
  }, [scores])

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({
        studentId,
        term,
        year,
        scores: scores.map((s) => ({
          criteriaId: s.criteriaId,
          score: getScore(s),
          note: localNotes[s.criteriaId] ?? s.note,
        })),
        comment,
      })
      toast.success('Lưu điểm rèn luyện thành công')
      router.back()
    } catch {
      toast.error('Lỗi khi lưu điểm')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={`Nhập điểm rèn luyện – ${data?.student?.name ?? ''}`}
        breadcrumbs={[
          { label: 'GDĐT', href: '/gddt/classes' },
          { label: 'Học sinh', href: '/gddt/classes' },
          { label: data?.student?.name ?? '', href: '#' },
          { label: 'Điểm RL' },
        ]}
      />

      {/* Student info */}
      {data?.student && (
        <Card className="mb-4">
          <CardContent className="flex flex-wrap gap-6 py-3 text-sm">
            <div>
              <span className="text-muted-foreground">Họ tên:</span>{' '}
              <span className="font-medium">{data.student.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Mã HS:</span>{' '}
              <span className="font-medium">{data.student.code}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Lớp:</span>{' '}
              <span className="font-medium">{data.className}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Năm học:</span>{' '}
              <span className="font-medium">{year}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Term selector */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Nhập điểm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Học kỳ:</span>
            <Select value={term} onValueChange={(v) => { if (v) setTerm(v) }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HK1">Học kỳ 1</SelectItem>
                <SelectItem value="HK2">Học kỳ 2</SelectItem>
                <SelectItem value="CN">Cả năm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scoring table */}
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhóm</TableHead>
                  <TableHead>Tiêu chí</TableHead>
                  <TableHead className="w-[100px]">Điểm tối đa</TableHead>
                  <TableHead className="w-[120px]">Điểm nhập</TableHead>
                  <TableHead className="w-[200px]">Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(grouped).map(([group, groupScores]) => (
                  groupScores.map((s, idx) => (
                    <TableRow key={s.criteriaId}>
                      {idx === 0 && (
                        <TableCell rowSpan={groupScores.length} className="font-medium bg-muted/50 align-top">
                          {group}
                        </TableCell>
                      )}
                      <TableCell>{s.criteriaName}</TableCell>
                      <TableCell className="text-center">{s.maxScore}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={s.maxScore}
                          value={getScore(s)}
                          onChange={(e) => handleScoreChange(s.criteriaId, Number(e.target.value), s.maxScore)}
                          className="w-[80px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={localNotes[s.criteriaId] ?? s.note ?? ''}
                          onChange={(e) => handleNoteChange(s.criteriaId, e.target.value)}
                          placeholder="Ghi chú"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ))}
                {scores.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Chưa có tiêu chí nào
                    </TableCell>
                  </TableRow>
                )}
                {scores.length > 0 && (
                  <TableRow className="bg-muted/30 font-medium">
                    <TableCell colSpan={2} className="text-right">Tổng điểm:</TableCell>
                    <TableCell className="text-center">
                      {scores.reduce((sum, s) => sum + s.maxScore, 0)}
                    </TableCell>
                    <TableCell className="text-center text-lg">{totalScore}</TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nhận xét tổng quát</label>
            <Textarea
              value={comment || data?.comment || ''}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Nhận xét tổng quát về rèn luyện..."
            />
          </div>

          {/* Classification */}
          {scores.length > 0 && (
            <Card>
              <CardContent className="flex items-center gap-4 py-3">
                <span className="text-sm text-muted-foreground">Xếp loại:</span>
                <Badge variant={classification.variant} className="text-sm px-3 py-1">
                  {classification.label}
                </Badge>
                <span className="text-sm text-muted-foreground">({totalScore} điểm)</span>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">
          Hủy
        </Button>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="cursor-pointer">
          {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Lưu điểm
        </Button>
      </div>
    </div>
  )
}
