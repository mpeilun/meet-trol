import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
      const data = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        include: {
          courses: true,
        },
      })
      res.status(200).json(data)
    } else {
      res.status(403).json({ message: 'forbidden' })
    }
  }

  res.status(400).json({ message: 'bad request' })
}

export default handler
