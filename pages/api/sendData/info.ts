import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { Info } from '@prisma/client'

async function handler(req: NextApiRequest, res: NextApiResponse) {

  
  if (req.method === 'DELETE') {
    const data = JSON.parse(req.body)
    const deleteInfo = await prisma.info.delete({
      where: { id: data.id},
    })
    res.status(200).json(deleteInfo)
  } 

   if (req.method === 'POST') {
    const data = req.body
    const createInfo = await prisma.info.create({
      data: {
        ...data,
      },
    })
    res.status(200).json(createInfo)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
 
}

export default handler
