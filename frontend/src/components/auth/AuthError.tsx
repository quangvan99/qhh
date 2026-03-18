'use client'

import { useSearchParams } from 'next/navigation'

const errorMessages: Record<string, string> = {
  OAuthSignin: 'Lỗi khởi tạo OAuth. Vui lòng thử lại.',
  OAuthCallback: 'Lỗi xác thực OAuth. Vui lòng thử lại.',
  OAuthCreateAccount: 'Không thể tạo tài khoản OAuth.',
  EmailCreateAccount: 'Không thể tạo tài khoản email.',
  Callback: 'Lỗi callback. Vui lòng thử lại.',
  OAuthAccountNotLinked: 'Email đã được dùng với phương thức đăng nhập khác.',
  EmailSignin: 'Lỗi gửi email xác thực.',
  CredentialsSignin: 'Tên đăng nhập hoặc mật khẩu không đúng.',
  SessionRequired: 'Vui lòng đăng nhập để tiếp tục.',
  Default: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
}

export function AuthError() {
  const params = useSearchParams()
  const error = params.get('error')

  if (!error) return null

  const message = errorMessages[error] ?? errorMessages.Default

  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
      {message}
    </div>
  )
}
