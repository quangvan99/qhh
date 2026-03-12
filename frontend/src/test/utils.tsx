import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import { type ReactNode } from 'react'
import { vi } from 'vitest'

// Mock next/navigation globally
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  redirect: vi.fn(),
  notFound: vi.fn(),
}))

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'admin' },
    },
    status: 'authenticated',
  }),
  signIn: vi.fn().mockResolvedValue({ ok: true, error: null }),
  signOut: vi.fn().mockResolvedValue(undefined),
  SessionProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

export function renderWithProviders(
  ui: ReactNode,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  const queryClient = createTestQueryClient()
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
  return render(ui, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
