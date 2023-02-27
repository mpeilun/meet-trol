import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const data = JSON.parse(req.body)
    const deleteVideo = await prisma.video.delete({
      where: { id: data.id },
    })
    res.status(200).json(deleteVideo)
  } else if (req.method === 'POST') {
    const data = req.body
    const createVideo = await prisma.video.create({
      data: {
        ...data,
      },
    })
    res.status(200).json(createVideo)
  } else if (req.method === 'GET') {
    const data = await prisma.video.findMany()
    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler
