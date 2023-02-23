import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './[...nextauth]'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    res.status(200).json({
      content: 'This is protected content. You can access this content because you are signed in.',
      session: session,
    })
  } else {
    res.status(403).json({
      error: 'You must be signed in to view the protected content on this page.',
    })
  }
}

export default handler
