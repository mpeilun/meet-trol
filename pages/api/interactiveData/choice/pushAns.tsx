import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../api/auth/[...nextauth]'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { answers, choiceId } = req.body
    const session = await getServerSession(req, res, authOptions)
    if (session) {
      const choice = await prisma.choice.findUnique({
        where: {
          id: choiceId,
        },
        select: {
          options: true,
        },
      })

      
      const correctAnswer = []
      choice.options.map(({ isAnswer }, index) => {
        if (isAnswer === true) {
          correctAnswer.push(index)
        }
      })
      const isCorrect = correctAnswer.every(
        (answer, index) => answer === answers[index]
      )

      const data = await prisma.choiceFeedback.create({
        data: {
          answers: answers,
          createdAt: new Date(),
          userId: session.user.id,
          isCorrect: isCorrect,
          choice: {
            connect: {
              id: choiceId,
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
