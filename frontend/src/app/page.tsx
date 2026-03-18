/**
 * Root page — serves as landing point after login.
 * Middleware in proxy.ts handles role-based redirect:
 *   admin   → /admin/dashboard
 *   teacher → /giaovien/dashboard
 *   student → /hocsinh/home
 *
 * This page renders nothing; middleware will redirect authenticated users.
 * Unauthenticated users are redirected to /login by middleware.
 */
export default function RootPage() {
  return null
}
