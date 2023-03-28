import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Course, Chapter } from '@prisma/client'
import { ChapterCreateType } from '../../../types/chapter'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { courseId, chapterId } = req.query as {
    courseId: string
    chapterId?: string
  }

  //判斷是否登入
  if (session) {
    if (req.method === 'GET') {
      if (!courseId) {
        return res
          .status(404)
          .json({ message: 'No Found, need parameter ?courseId=[objectId]' })
      }

      const check = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          membersId: true,
        },
      })
      if (check.membersId.includes(session.user.id)) {
        const data = await prisma.chapter.findMany({
          where: {
            courseId: courseId,
          },
          select: {
            title: true,
            videos: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        })
        return res.status(200).json(data)
      } else {
        return res.status(403).json({ message: 'Forbidden' })
      }
    } else if (req.method === 'POST') {
      if (!courseId) {
        return res
          .status(404)
          .json({ message: 'No Found, need parameter ?courseId=[objectId]' })
      }
      const data: ChapterCreateType = req.body

      const check = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          ownerId: true,
        },
      })
      if (check.ownerId.includes(session.user.id)) {
        // const create = await prisma.course.update({
        //   where: {
        //     id: courseId,
        //   },
        //   data: {
        //     chapters: {
        //       create: {
        //         ...data,
        //       },
        //     },
        //   },
        // })

        const create = await prisma.chapter.create({
          data: {
            ...data,
            courseId: courseId,
          },
        })

        return res.status(201).json(create)
      } else {
        return res.status(403).json({ message: 'Forbidden' })
      }
    } else if (req.method === 'PUT') {
      if (!courseId || !chapterId) {
        return res.status(404).json({
          message:
            'No Found, need parameter ?courseId=[objectId]?chapterId=[chapterId]',
        })
      }
      const data: Chapter = req.body
      const check = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          ownerId: true,
        },
      })
      if (check.ownerId.includes(session.user.id)) {
        const update = await prisma.chapter.update({
          where: {
            id: chapterId,
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
      if (!courseId || !chapterId) {
        return res.status(404).json({
          message:
            'No Found, need parameter ?courseId=[objectId]?chapterId=[chapterId]',
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
        const update = await prisma.chapter.delete({
          where: {
            id: chapterId,
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
