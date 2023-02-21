import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = JSON.parse(req.body)
    const deleteInfo = await prisma.info.delete({
      where: { id: data.id },
    })
    res.status(200).json(deleteInfo)
  } else if (req.method === 'GET') {
    const query = req.query as { id: string }
    const data = await prisma.info.findMany({
      where: {
        videoId: query.id,
      },
    })
    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler
