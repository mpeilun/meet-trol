import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
  } else if (req.method === 'GET') {
    const query = req.query as { id: string }
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
    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler
