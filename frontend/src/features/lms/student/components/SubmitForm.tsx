'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, FileIcon, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/composite'
import { AppBadge } from '@/components/base'
import { useGetMyAssignment, useSubmitAssignment, useSaveDraft } from '../api/student.api'
import { Skeleton } from '@/components/ui/skeleton'

interface SubmitFormProps {
  classId: string
  assignmentId: string
}

export function SubmitForm({ classId, assignmentId }: SubmitFormProps) {
  const router = useRouter()
  const { data: assignment, isLoading } = useGetMyAssignment(assignmentId)
  const submitMutation = useSubmitAssignment()
  const saveDraftMutation = useSaveDraft()
  const [files, setFiles] = useState<File[]>([])
  const [textContent, setTextContent] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-save draft every 30s
  useEffect(() => {
    if (!assignment || assignment.status !== 'pending') return
    if (!textContent) return

    if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    autoSaveRef.current = setTimeout(() => {
      saveDraftMutation.mutate({ assignmentId, textContent })
    }, 30000)

    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textContent, assignmentId])

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selectedFiles = Array.from(e.target.files)
    setFiles((prev) => [...prev, ...selectedFiles])
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleSubmit = async () => {
    await submitMutation.mutateAsync({
      assignmentId,
      files: files.length > 0 ? files : undefined,
      textContent: textContent || undefined,
    })
    router.push(`/my-classes/${classId}/assignments/${assignmentId}/result`)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!assignment) return null

  const deadline = new Date(assignment.deadline)
  const isExpired = deadline.getTime() < Date.now()
  const hoursLeft = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / (1000 * 60 * 60)))

  return (
    <div className="space-y-6">
      {/* Assignment info */}
      <Card>
        <CardHeader>
          <CardTitle>{assignment.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Hạn nộp: {deadline.toLocaleDateString('vi-VN', {
              day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })}</span>
          </div>
          {hoursLeft < 24 && !isExpired && (
            <p className="text-sm font-medium text-red-600">
              Còn {hoursLeft} giờ {Math.floor(((deadline.getTime() - Date.now()) % (1000 * 60 * 60)) / (1000 * 60))} phút
            </p>
          )}
          <p className="text-sm">Điểm tối đa: {assignment.maxScore}</p>
          <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: assignment.description }} />
        </CardContent>
      </Card>

      {/* Already submitted */}
      {(assignment.status === 'submitted' || assignment.status === 'graded') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Bài nộp của tôi
              <AppBadge semantic={assignment.status === 'graded' ? 'success' : 'info'} size="sm">
                {assignment.status === 'graded' ? 'Đã chấm' : 'Đã nộp'}
              </AppBadge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {assignment.submittedAt && (
              <p className="text-sm text-muted-foreground">
                Thời điểm nộp: {new Date(assignment.submittedAt).toLocaleString('vi-VN')}
              </p>
            )}
            {assignment.score !== undefined && (
              <p className="text-lg font-bold">Điểm: {assignment.score}/{assignment.maxScore}</p>
            )}
            {assignment.feedback && (
              <div>
                <p className="text-sm font-medium">Nhận xét:</p>
                <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
              </div>
            )}
            {assignment.submissionFiles && assignment.submissionFiles.length > 0 && (
              <div>
                <p className="text-sm font-medium">File đã nộp:</p>
                <ul className="space-y-1">
                  {assignment.submissionFiles.map((f: { name: string; url: string }, i: number) => (
                    <li key={i}>
                      <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {f.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submit form - only if pending */}
      {assignment.status === 'pending' && !isExpired && (
        <Card>
          <CardHeader>
            <CardTitle>Bài làm của tôi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(assignment.type === 'text' || assignment.type === 'both') && (
              <div>
                <label className="mb-2 block text-sm font-medium">Nội dung văn bản</label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Nhập nội dung bài làm..."
                  rows={8}
                />
              </div>
            )}

            {(assignment.type === 'file' || assignment.type === 'both') && (
              <div>
                <label className="mb-2 block text-sm font-medium">Tệp đính kèm</label>
                <div
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-muted-foreground/50"
                >
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Kéo thả file vào đây hoặc</p>
                  <label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" className="mt-2 cursor-pointer" render={<span />}>
                      Chọn file
                    </Button>
                  </label>
                </div>

                {files.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {files.map((file, i) => (
                      <li key={i} className="flex items-center justify-between rounded-md border p-2">
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button onClick={() => removeFile(i)} className="cursor-pointer text-muted-foreground hover:text-foreground">
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => saveDraftMutation.mutate({ assignmentId, textContent })}
                disabled={saveDraftMutation.isPending}
                className="cursor-pointer"
              >
                Lưu nháp
              </Button>
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={submitMutation.isPending}
                className="cursor-pointer"
              >
                Nộp bài
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isExpired && assignment.status === 'pending' && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-lg font-medium text-red-600">Đã hết hạn nộp bài</p>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Xác nhận nộp bài"
        description="Bạn có chắc muốn nộp bài? Sau khi nộp không thể hoàn tác."
        onConfirm={handleSubmit}
        confirmLabel="Nộp bài"
        loading={submitMutation.isPending}
        variant="warning"
      />
    </div>
  )
}
