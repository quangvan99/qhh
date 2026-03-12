import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

declare module 'next-auth' {
  interface User {
    role?: string
    unitId?: string
  }
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      unitId?: string
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: string
    unitId?: string
    id?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: 'hues',
      name: 'HUE-S Portal',
      type: 'oidc',
      issuer: process.env.HUES_ISSUER,
      clientId: process.env.HUES_CLIENT_ID,
      clientSecret: process.env.HUES_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? 'student',
          unitId: profile.unit_id,
        }
      },
    },
    Credentials({
      credentials: {
        username: { label: 'Tên đăng nhập', type: 'text' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const u = credentials.username as string
        const p = credentials.password as string

        // Dev credentials fallback (always available)
        const devUsers: Record<string, { id: string; name: string; email: string; role: string }> = {
          'admin:admin123': { id: '1', name: 'Quản trị viên', email: 'admin@quochoc.edu.vn', role: 'admin' },
          'teacher:teacher123': { id: '2', name: 'Nguyễn Văn A', email: 'teacher@quochoc.edu.vn', role: 'teacher' },
          'student:student123': { id: '3', name: 'Trần Thị B', email: 'student@quochoc.edu.vn', role: 'student' },
        }

        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
          const res = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p }),
          })

          if (res.ok) {
            const user = await res.json()
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role ?? 'student',
              unitId: user.unitId,
            }
          }
        } catch {
          // Backend unavailable, fall through to dev credentials
        }

        return devUsers[`${u}:${p}`] ?? null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as { role?: string }).role
        token.unitId = (user as { unitId?: string }).unitId
        token.id = user.id
      }
      if (account?.provider === 'hues') {
        // Could enrich with additional API call here
        // const userInfo = await fetchUserRole(token.sub)
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.user.unitId = token.unitId
        session.user.id = token.id ?? ''
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith('/')) return `${baseUrl}${url}`
      return `${baseUrl}/`
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})
