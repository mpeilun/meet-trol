import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    account: Account
    user: {
      email: string
      image: string
      name: string
    }
  }
}

// declare module 'next-auth/jwt' {
//   interface JWT {
//     accessToken?: string
//   }
// }

//reference https://stackoverflow.com/questions/74168539/next-auth-provide-types-for-callback-functions-parameters
