import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../api/auth/[...nextauth]'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { answers, dragId } = req.body
    const session = await getServerSession(req, res, authOptions)
    if (session) {
      const drag = await prisma.drag.findUnique({
        where: {
          id: dragId,
        },
        select: {
          options: true,
        },
      })

      const x = drag.options[0].x
      const y = drag.options[0].y
      const width = drag.options[0].width
      const height = drag.options[0].height
      const isCorrect =
        answers.x >= x &&
        answers.x <= x + width &&
        answers.y >= y &&
        answers.y <= y + height

      const data = await prisma.dragFeedback.create({
        data: {
          answers: answers,
          createdAt: new Date(),
          userId: session.user.id,
          isCorrect: isCorrect,
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
