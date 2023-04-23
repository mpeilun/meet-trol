import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../api/auth/[...nextauth]'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { answers, fillId } = req.body
    const session = await getServerSession(req, res, authOptions)
    if (session) {
      const fill = await prisma.fill.findUnique({
        where: {
          id: fillId,
        },
        select: {
          question: true,
        },
      })
      const regex = /(?<=\().+?(?=\))/g // 正則表達式 匹配所有括號內的文字
      const correctAnswer: string[] = fill.question.match(regex)
      const isCorrect = correctAnswer.every(
        (answer, index) => answer === answers[index]
      )

      const data = await prisma.fillFeedback.create({
        data: {
          answers: answers,
          createdAt: new Date(),
          isCorrect: isCorrect,
          userId: session.user.id,
          fill: {
            connect: {
              id: fillId,
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
