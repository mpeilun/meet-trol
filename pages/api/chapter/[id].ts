import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
  } else if (req.method === 'GET') {
    const query = req.query as { id: string }
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(query.id)

    if (isValidObjectId) {
      const data = await prisma.chapter.findMany({
        where: {
          courseId: query.id,
        },
        include: {
          videos: {
            include: {
              info: true,
              choice: true,
              rank: true,
              fill: true,
              drag: true,
            },
          },
        },
      })
      res.status(200).json(data)
    } else {
      res.status(500).json({ message: '404 Not Found' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler
