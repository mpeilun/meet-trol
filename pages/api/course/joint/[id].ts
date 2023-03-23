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
      try {
        const check = await prisma.course.findUnique({
          where: {
            id: query.id,
          },
          select: {
            membersId: true,
          },
        })

        if (check?.membersId.includes(session.user.id)) {
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

          //TODO 預先加入 ViewRecord

          await prisma.user.update({
            where: {
              id: session.user.id,
            },
            data: {
              records: {
                create: {
                  courseId: query.id,
                },
              },
            },
          })

          res.status(201).json({
            ...update,
            message: 'Success',
          })
        }
      } catch (err) {
        res.status(404).json({
          message: err,
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
