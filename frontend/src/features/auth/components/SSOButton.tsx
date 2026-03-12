'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Landmark, Loader2 } from 'lucide-react'
import { AppButton } from '@/components/base/app-button'

export function SSOButton() {
  const [loading, setLoading] = useState(false)

  const handleSSO = async () => {
    setLoading(true)
    try {
      await signIn('hues', { callbackUrl: '/' })
    } catch {
      setLoading(false)
    }
  }

  return (
    <AppButton
      type="button"
      onClick={handleSSO}
      loading={loading}
      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
      size="lg"
    >
      {!loading && <Landmark className="mr-2 h-5 w-5" />}
      Đăng nhập qua HUE-S Portal
    </AppButton>
  )
}
