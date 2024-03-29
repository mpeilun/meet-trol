import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
  } else if (req.method === 'GET') {
    const query = req.query as { id: string }
    const isValidObjectId =
      typeof query.id === 'string' &&
      query.id.length === 24 &&
      /^[a-f0-9]+$/i.test(query.id)

    if (isValidObjectId) {
      const data = await prisma.video.findUnique({
        where: {
          id: query.id,
        },
        include: {
          info: true,
          choice: { include: { feedback: true } },
          rank: { include: { feedback: true } },
          fill: { include: { feedback: true } },
          drag: { include: { feedback: true } },
        },
      })
      const { info, choice, rank, fill, drag, ...result } = data
      res.status(200).json({
        ...result,
        questions: [...info, ...choice, ...rank, ...fill, ...drag],
      })
    } else {
      res.status(400).json({ message: 'Error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler
