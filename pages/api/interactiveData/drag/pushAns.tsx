import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../api/auth/[...nextauth]'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { answers, dragId } = req.body
    const session = await getServerSession(req, res, authOptions)
    if (session) {
      const data = await prisma.dragFeedback.create({
        data: {
          answers: answers,
          userId: session.user.id,
          drag: {
            connect: {
              id: dragId,
            },
          },
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
