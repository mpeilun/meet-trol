import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../api/auth/[...nextauth]'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const query = req.query as { id: string }
    const session = await getServerSession(req, res, authOptions)
    if (session) {
      const data = await prisma.record.findMany({
        where: {
          courseId: query.id,
          userId: session.user.id,
        },
        select: {
          lastView: {
            select: {
                videoId: true,
                videoTime: true,
                viewTime: true,
            }
          }
        },
      })
      res.status(200).json(data)
    } else {
      res.status(403).json({ message: 'forbidden' })
    }
  } else {
    res.status(400).json({ message: 'bad request' })
  }
}

export default handler
