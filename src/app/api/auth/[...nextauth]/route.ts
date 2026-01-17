import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://list-backend-sjkn.onrender.com/api'

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
        isRegister: { label: 'Is Register', type: 'text' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        try {
          const isRegister = credentials.isRegister === 'true'
          const endpoint = isRegister ? '/auth/register' : '/auth/login'
          
          const body: { email: string; password: string; name?: string } = {
            email: credentials.email,
            password: credentials.password,
          }
          
          if (isRegister && credentials.name) {
            body.name = credentials.name
          }

          const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || 'Erro de autenticação')
          }

          // Return user with access token
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.image,
            accessToken: data.access_token,
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message)
          }
          throw new Error('Erro ao conectar com o servidor')
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.accessToken = (user as any).accessToken
      }
      
      // Handle Google OAuth - create user in backend
      if (account?.provider === 'google' && user) {
        // Use a consistent password based on Google ID (not Date.now() which changes!)
        const googlePassword = `google_oauth_${user.id}`
        
        try {
          // First try to login (user might already exist)
          const loginResponse = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              password: googlePassword,
            }),
          })
          
          if (loginResponse.ok) {
            const data = await loginResponse.json()
            token.id = data.user.id
            token.accessToken = data.access_token
          } else {
            // User doesn't exist, try to register
            const registerResponse = await fetch(`${API_URL}/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                password: googlePassword,
                name: user.name,
              }),
            })

            if (registerResponse.ok) {
              const data = await registerResponse.json()
              token.id = data.user.id
              token.accessToken = data.access_token
            } else {
              console.error('Failed to register/login Google user')
            }
          }
        } catch (error) {
          console.error('Error syncing Google user with backend:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session as any).accessToken = token.accessToken
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
