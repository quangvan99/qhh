'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AppBadge } from '@/components/base/app-badge'
import { PageHeader } from '@/components/composite/page-header'
import { toast } from 'sonner'
import { Wifi, WifiOff, ShieldCheck, Save } from 'lucide-react'

export function SyncConfigPage() {
  const [endpointLGSP, setEndpointLGSP] = useState('https://lgsp.thuathienhue.gov.vn/api/v1')
  const [endpointNGSP, setEndpointNGSP] = useState('https://ngsp.gov.vn/api/v1')
  const [apiKey, setApiKey] = useState('sk-****-****-****')
  const [token, setToken] = useState('tk-****-****-****')
  const [timeout, setTimeout] = useState('30')
  const [useSSL, setUseSSL] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected')
  const [testing, setTesting] = useState(false)

  const handleTestConnection = () => {
    setTesting(true)
    window.setTimeout(() => {
      setConnectionStatus('connected')
      setTesting(false)
      toast.success('Kết nối thành công đến LGSP')
    }, 1500)
  }

  const handleSave = () => {
    toast.success('Đã lưu cấu hình kết nối')
  }

  return (
    <div>
      <PageHeader
        title="Cấu hình kết nối GDĐT"
        subtitle="Thiết lập kết nối đồng bộ dữ liệu với hệ thống GDĐT"
        breadcrumbs={[
          { label: 'GDĐT', href: '/gddt/sync/config' },
          { label: 'Đồng bộ', href: '/gddt/sync/config' },
          { label: 'Cấu hình kết nối' },
        ]}
      />

      <div className="space-y-6 max-w-2xl">
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Trạng thái kết nối</CardTitle>
              {connectionStatus === 'connected' ? (
                <AppBadge semantic="success" dot>
                  <Wifi className="h-3 w-3 mr-1" /> Đã kết nối
                </AppBadge>
              ) : (
                <AppBadge semantic="error" dot>
                  <WifiOff className="h-3 w-3 mr-1" /> Mất kết nối
                </AppBadge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Endpoint Config */}
        <Card>
          <CardHeader><CardTitle className="text-base">Cấu hình Endpoint</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lgsp">Endpoint LGSP</Label>
              <Input id="lgsp" value={endpointLGSP} onChange={(e) => setEndpointLGSP(e.target.value)} placeholder="https://lgsp.example.com/api/v1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ngsp">Endpoint NGSP</Label>
              <Input id="ngsp" value={endpointNGSP} onChange={(e) => setEndpointNGSP(e.target.value)} placeholder="https://ngsp.example.com/api/v1" />
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card>
          <CardHeader><CardTitle className="text-base">Xác thực</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Nhập API Key" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Token</Label>
              <Input id="token" type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Nhập Token" />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader><CardTitle className="text-base">Cấu hình nâng cao</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (giây)</Label>
              <Input id="timeout" type="number" value={timeout} onChange={(e) => setTimeout(e.target.value)} min="5" max="120" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={useSSL} onCheckedChange={(v) => setUseSSL(!!v)} id="ssl" />
              <Label htmlFor="ssl" className="cursor-pointer flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Sử dụng SSL
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button onClick={handleTestConnection} variant="outline" disabled={testing} className="cursor-pointer">
            <Wifi className="h-4 w-4 mr-2" />
            {testing ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
          </Button>
          <Button onClick={handleSave} className="cursor-pointer">
            <Save className="h-4 w-4 mr-2" />
            Lưu cấu hình
          </Button>
        </div>
      </div>
    </div>
  )
}
