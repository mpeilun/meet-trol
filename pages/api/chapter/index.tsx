import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const data = JSON.parse(req.body)
    const deleteChapter = await prisma.chapter.delete({
      where: { id: data.id },
    })
    res.status(200).json(deleteChapter)
  } else if (req.method === 'POST') {
    const data = req.body
    const createChapter = await prisma.chapter.create({
      data: {
        ...data,
      },
    })
    res.status(200).json(createChapter)
  } else if (req.method === 'GET') {
    const data = await prisma.chapter.findMany({})
    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler
