'use client'

import { usePathname, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/composite/page-header'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Chung', href: '/admin/settings/general' },
  { label: 'Email', href: '/admin/settings/email' },
  { label: 'Bảo mật', href: '/admin/settings/security' },
]

interface SettingsTabsProps {
  children: React.ReactNode
}

export function SettingsTabs({ children }: SettingsTabsProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div>
      <PageHeader
        title="Cài đặt hệ thống"
        subtitle="Cấu hình các thiết lập hệ thống"
        breadcrumbs={[
          { label: 'Quản trị', href: '/admin/settings/general' },
          { label: 'Cài đặt' },
        ]}
      />

      <div className="border-b mb-6">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.href}
              type="button"
              onClick={() => router.push(tab.href)}
              className={cn(
                'pb-3 text-sm font-medium cursor-pointer border-b-2 transition-colors',
                pathname === tab.href
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {children}
    </div>
  )
}
