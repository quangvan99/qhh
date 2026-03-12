'use client'

import { useSearchParams } from 'next/navigation'

const ERROR_MESSAGES: Record<string, string> = {
  Credentials: 'Tên đăng nhập hoặc mật khẩu không đúng',
  AccessDenied: 'Tài khoản không có quyền truy cập',
  OAuthSignin: 'Lỗi kết nối HUE-S Portal. Vui lòng thử lại',
  OAuthCallback: 'Lỗi xác thực từ HUE-S Portal',
  Default: 'Đã xảy ra lỗi. Vui lòng thử lại',
}

export function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  if (!error) return null

  const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
      <p>{message}</p>
    </div>
  )
}
