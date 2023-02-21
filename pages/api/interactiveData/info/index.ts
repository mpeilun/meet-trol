import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const data = JSON.parse(req.body)
    const deleteInfo = await prisma.info.delete({
      where: { id: data.id },
    })
    res.status(200).json(deleteInfo)
  } else if (req.method === 'POST') {
    const data = req.body
    const createInfo = await prisma.info.create({
      data: {
        ...data,
      },
    })
    res.status(200).json(createInfo)
  } else if (req.method === 'GET') {
    const { pid } = req.query
    console.log(pid)
    const data = await prisma.info.findMany({})
    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler
