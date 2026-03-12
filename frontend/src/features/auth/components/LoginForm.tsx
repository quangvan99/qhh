'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { AppInput } from '@/components/base/app-input'
import { AppButton } from '@/components/base/app-button'
import type { LoginCredentials } from '../types/auth.types'

const loginSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập tối thiểu 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginCredentials) => {
    setLoading(true)
    setError(null)
    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng')
      } else if (result?.ok) {
        window.location.href = '/'
      }
    } catch {
      setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <AppInput
        label="Tên đăng nhập"
        placeholder="Nhập tên đăng nhập"
        leftAddon={<User className="h-4 w-4" />}
        error={errors.username?.message}
        required
        autoComplete="username"
        {...register('username')}
      />

      <AppInput
        label="Mật khẩu"
        type={showPassword ? 'text' : 'password'}
        placeholder="Nhập mật khẩu"
        leftAddon={<Lock className="h-4 w-4" />}
        rightAddon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        error={errors.password?.message}
        required
        autoComplete="current-password"
        {...register('password')}
      />

      <AppButton
        type="submit"
        loading={loading}
        className="w-full"
        size="lg"
      >
        Đăng nhập
      </AppButton>
    </form>
  )
}
