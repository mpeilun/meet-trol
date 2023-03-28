import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Course, Chapter } from '@prisma/client'
import { CourseCreateType } from '../../../types/course'
import { ChapterCreateType } from '../../../types/chapter'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { id } = req.query as { id: string }

  //判斷是否登入
  if (session) {
    if (req.method === 'POST') {
      const data: ChapterCreateType = JSON.parse(req.body)
      const create = await prisma.chapter.findUnique({
        where: {
          id: id,
        },
        
      return res.status(201).json(create)
    } else if (req.method === 'PUT') {
      if (!courseId) {
        return res
          .status(404)
          .json({ message: 'No Found, need parameter courseId: [objectId]' })
      }
      const data: Course = JSON.parse(req.body)
      const check = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          ownerId: true,
        },
      })
      if (check.ownerId.includes(session.user.id)) {
        const update = await prisma.course.update({
          where: {
            id: courseId,
          },
          data: {
            title: data.title,
            description: data.description,
            start: data.start,
            end: data.end,
          },
        })

        return res.status(201).json(update)
      } else {
        return res.status(403).json({ message: 'Forbidden' })
      }
    } else if (req.method === 'DELETE') {
      if (!courseId) {
        return res
          .status(404)
          .json({ message: 'No Found, need parameter courseId: [objectId]' })
      }
      const data: Course = req.body
      const check = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          ownerId: true,
        },
      })
      if (check.ownerId.includes(session.user.id)) {
        const update = await prisma.course.delete({
          where: {
            id: courseId,
          },
        })

        return res.status(204).json(update)
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
