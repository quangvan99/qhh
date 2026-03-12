import type { UserRole } from '@/types'

export interface AuthUser {
  id: string
  name: string
  email: string
  image?: string
  role: UserRole
  unitId?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthSession {
  user: AuthUser
  expires: string
}

export type AuthErrorType =
  | 'Credentials'
  | 'AccessDenied'
  | 'OAuthSignin'
  | 'OAuthCallback'
  | 'Default'

export const AUTH_ERROR_MESSAGES: Record<AuthErrorType, string> = {
  Credentials: 'Tên đăng nhập hoặc mật khẩu không đúng',
  AccessDenied: 'Tài khoản không có quyền truy cập',
  OAuthSignin: 'Lỗi kết nối HUE-S Portal. Vui lòng thử lại',
  OAuthCallback: 'Lỗi xác thực từ HUE-S Portal',
  Default: 'Đã xảy ra lỗi. Vui lòng thử lại',
}
