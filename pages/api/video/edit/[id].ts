import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../api/auth/[...nextauth]'
import { Video } from '../../../../types/video-edit'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  //判斷只接收 GET 請求
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions)
    //判斷是否登入
    if (session) {
      const query = req.query as { id: string }
      const isValidObjectId =
        typeof query.id === 'string' &&
        query.id.length === 24 &&
        /^[a-f0-9]+$/i.test(query.id)
      //驗證 objectId 是否符合格式
      if (isValidObjectId) {
        const data = await prisma.video.findUnique({
          where: {
            id: query.id,
          },
          select: {
            id: true,
            url: true,
            title: true,
            description: true,
            material: true,
            chapterId: true,
            chapter: { include: { course: true } },
            info: true,
            choice: true,
            rank: true,
            fill: true,
            drag: true,
          },
        })
        //判斷是否為課程擁有者
        if (data.chapter.course.ownerId.includes(session.user.id)) {
          const { info, choice, rank, fill, drag, ...result } = data

          res.status(200).json({
            ...result,
            question: [...info, ...choice, ...rank, ...fill, ...drag],
          })
        } else {
          res.status(403).json({ message: 'Forbidden' })
        }
      } else {
        res.status(404).json({ message: 'No Found' })
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

export default handler
