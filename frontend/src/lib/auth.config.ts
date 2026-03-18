import type { NextAuthConfig } from 'next-auth'

/**
 * Lightweight auth config — Edge Runtime safe (no heavy Node.js providers).
 * Used by middleware.ts to avoid Credentials/OIDC provider code in Edge.
 *
 * NextAuth v5: trustHost: true → reads Host header from request,
 * so redirect URLs use the actual origin (192.168.x.x, domain, localhost…)
 * instead of falling back to a hardcoded localhost default.
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [], // providers are added in lib/auth.ts (Node.js only)
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth }) {
      // Minimal check: is there a valid session?
      // Full route protection is handled in middleware.ts
      return !!auth?.user
    },
    async jwt({ token, user }) {
      if (user) {
        token.role   = (user as { role?: string }).role
        token.unitId = (user as { unitId?: string }).unitId
        token.id     = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        ;(session.user as { role?: string }).role     = token.role   as string | undefined
        ;(session.user as { unitId?: string }).unitId = token.unitId as string | undefined
        ;(session.user as { id?: string }).id         = (token.id as string | undefined) ?? (token.sub ?? '')
      }
      return session
    },
  },
}
