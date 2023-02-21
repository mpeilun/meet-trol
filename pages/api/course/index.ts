import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const data = JSON.parse(req.body)
    const deleteCourse = await prisma.course.delete({
      where: { id: data.id },
    })
    res.status(200).json(deleteCourse)
  } else if (req.method === 'POST') {
    const data = req.body
    const createCourse = await prisma.course.create({
      data: {
        ...data,
      },
    })
    res.status(200).json(createCourse)
  } else if (req.method === 'GET') {
    const data = await prisma.course.findMany({})
    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler
