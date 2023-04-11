import NextAuth, { Account, Awaitable, Session, User } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../prisma/prisma'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({
      token,
      account,
    }: {
      token: JWT
      account: Account
    }): Promise<JWT> {
      if (account) {
        // token.account = account
      }
      return token
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session
      token: JWT
      user: User
    }): Promise<Session> {
      // session.account = token.account
      session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }
      return session
    },
  },
}
export default NextAuth(authOptions)
