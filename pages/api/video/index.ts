import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Course, Chapter } from '@prisma/client'
import { VideoCreateType } from '../../../types/video'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { courseId, chapterId, videoId } = req.query as {
    courseId: string
    chapterId: string
    videoId?: string
  }

  //判斷是否登入
  if (session) {
    if (req.method === 'POST') {
      if (!courseId) {
        return res
          .status(404)
          .json({ message: 'No Found, need parameter ?courseId=[objectId]' })
      }
      const data: VideoCreateType = req.body

      const check = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          ownerId: true,
        },
      })
      if (check.ownerId.includes(session.user.id)) {
        const create = await prisma.video.create({
          data: {
            ...data,
            chapterId: chapterId,
          },
        })

        return res.status(201).json(create)
      } else {
        return res.status(403).json({ message: 'Forbidden' })
      }
    } else if (req.method === 'PUT') {
      if (!courseId || !videoId) {
        return res.status(404).json({
          message:
            'No Found, need parameter ?courseId=[objectId]?videoId=[objectId]',
        })
      }
      const data: VideoCreateType = req.body
      const check = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          ownerId: true,
        },
      })
      if (check.ownerId.includes(session.user.id)) {
        const update = await prisma.video.update({
          where: {
            id: videoId,
          },
          data: {
            ...data,
          },
        })

        return res.status(201).json(update)
      } else {
        return res.status(403).json({ message: 'Forbidden' })
      }
    } else if (req.method === 'DELETE') {
      console.log(chapterId, videoId)
      if (!chapterId || !videoId) {
        return res.status(404).json({
          message:
            'No Found, need parameter ?chapterId=[objectId]?videoId=[objectId]',
        })
      }

      const check = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          ownerId: true,
        },
      })
      if (check.ownerId.includes(session.user.id)) {
        const update = await prisma.video.delete({
          where: {
            id: videoId,
          },
        })

        return res.status(200).json(update)
      } else {
        return res.status(403).json({ message: 'Forbidden' })
      }
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' })
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export default handler
