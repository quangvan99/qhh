'use client'

import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/composite'
import { AppBadge, AppTextarea } from '@/components/base'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

interface PurchaseOrderReviewProps {
  orderId: string
}

const mockOrder = {
  id: '1',
  title: 'Lập trình Python nâng cao',
  author: 'Nguyễn Văn An',
  publisher: 'NXB Giáo dục',
  quantity: 10,
  estimatedPrice: 150000,
  reason: 'Bổ sung tài liệu cho chương trình đào tạo CNTT năm học 2026-2027',
  department: 'Khoa Công nghệ Thông tin',
  requestedBy: 'Trần Thị Bình',
  requestedAt: '2026-03-10T08:00:00.000Z',
  status: 'pending' as const,
}

export function PurchaseOrderReview({ orderId }: PurchaseOrderReviewProps) {
  const router = useRouter()
  const [reviewNote, setReviewNote] = useState('')
  const order = { ...mockOrder, id: orderId }

  const handleApprove = () => {
    toast.success('Đã duyệt yêu cầu đặt mua')
    router.push('/library/orders')
  }

  const handleReject = () => {
    if (!reviewNote.trim()) {
      toast.error('Vui lòng nhập ghi chú khi từ chối')
      return
    }
    toast.success('Đã từ chối yêu cầu đặt mua')
    router.push('/library/orders')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Duyệt yêu cầu #${order.id}`}
        breadcrumbs={[
          { label: 'Thư viện', href: '/library/catalog' },
          { label: 'Đơn đặt mua', href: '/library/orders' },
          { label: `Duyệt #${order.id}` },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin ấn phẩm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Tên ấn phẩm" value={order.title} />
            <InfoRow label="Tác giả" value={order.author} />
            <InfoRow label="Nhà xuất bản" value={order.publisher} />
            <InfoRow label="Số lượng" value={String(order.quantity)} />
            <InfoRow label="Đơn giá ước tính" value={`${order.estimatedPrice.toLocaleString('vi-VN')} VND`} />
            <InfoRow label="Tổng ước tính" value={`${(order.quantity * order.estimatedPrice).toLocaleString('vi-VN')} VND`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin đề xuất</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Người đề xuất" value={order.requestedBy} />
            <InfoRow label="Đơn vị" value={order.department} />
            <InfoRow label="Ngày tạo" value={new Date(order.requestedAt).toLocaleDateString('vi-VN')} />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trạng thái</span>
              <AppBadge semantic="warning">Chờ duyệt</AppBadge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Lý do đề xuất</span>
              <p className="text-sm mt-1">{order.reason}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ghi chú duyệt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AppTextarea
            placeholder="Nhập ghi chú (bắt buộc khi từ chối)..."
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            minRows={3}
          />
          <div className="flex justify-end gap-3">
            <Button variant="destructive" onClick={handleReject} className="cursor-pointer">
              <XCircle className="h-4 w-4 mr-2" />
              Từ chối
            </Button>
            <Button onClick={handleApprove} className="cursor-pointer bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Duyệt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
