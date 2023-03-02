import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    //# create course
    const result = await prisma.course.create({
      data: {
        title: 'New course 4',
        description: `fake data create at ${Date.now().toLocaleString('zh-TW')}`,
        mebersId: ['63f9ae2dc0c1b35a267f6473'],
      },
    })
    // const result = await prisma.user.update({ where: { id: '63f9ae2dc0c1b35a267f6473' }, data: { coursesId: ['63f9bb439c14d1bb7862ce72'] } })

    res.status(200).json(result)
  }
}

export default handler
