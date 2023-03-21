import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  //判斷只接收 GET 請求
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions)
    //判斷是否登入
    if (session) {
      const query = req.query as { id: string }
      const preSearch = await prisma.course.findUnique({
        where: {
          id: query.id,
        },
        select: {
          membersId: true,
        },
      })

      if (preSearch.membersId.includes(session.user.id)) {
        res.status(409).json({ message: '已經在課程成員中!' })
      } else {
        const update = await prisma.course.update({
          where: {
            id: query.id,
          },
          data: {
            membersId: {
              push: session.user.id,
            },
          },
        })
        res.status(201).json({
          ...update,
          message: 'Success',
        })
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

export default handler
