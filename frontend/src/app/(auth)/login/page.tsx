import { Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { SSOButton } from '@/features/auth/components/SSOButton'
import { AuthError } from '@/features/auth/components/AuthError'

export const metadata = {
  title: 'Đăng nhập — THPT Quốc Học Huế',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">QH</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              THPT Quốc Học Huế
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Hệ thống quản lý trường học
            </p>
          </div>

          {/* Auth error from URL params */}
          <Suspense fallback={null}>
            <AuthError />
          </Suspense>

          {/* SSO Button */}
          <div className="mt-4">
            <SSOButton />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-muted-foreground">
              hoặc đăng nhập nội bộ
            </span>
          </div>

          {/* Credentials form */}
          <LoginForm />

          {/* Footer link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-teal-600 hover:underline cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Page footer */}
      <p className="fixed bottom-4 text-xs text-muted-foreground">
        © 2026 THPT Quốc Học Huế
      </p>
    </div>
  )
}
