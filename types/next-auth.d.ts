import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import type { User as PrismaUserType } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string
      email?: string
      image?: string
    }
  }
}

// declare module 'next-auth/jwt' {
//   interface JWT {
//     accessToken?: string
//   }
// }

//reference https://stackoverflow.com/questions/74168539/next-auth-provide-types-for-callback-functions-parameters
