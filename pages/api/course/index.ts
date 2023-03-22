import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Course } from '@prisma/client'
import { CourseCreateType } from '../../../types/course'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { courseId, myCourse } = req.query as {
    courseId?: string
    myCourse?: boolean
  }

  //公開課程列表
  if (req.method == 'GET' && !myCourse) {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
      },
    })
    return res.status(200).json(courses)
  }

  //判斷是否登入
  if (session) {
    //GET 取得已加入課程列表
    if (req.method === 'GET') {
      const session = await getServerSession(req, res, authOptions)

      const courses = await prisma.course.findMany({
        where: {
          membersId: {
            has: session.user.id,
          },
        },
      })

      return res.status(200).json(courses)
    } else if (req.method === 'POST') {
      const data: CourseCreateType = req.body
      const create = await prisma.course.create({
        data: {
          title: data.title,
          description: data.description,
          ownerId: [session.user.id],
          chapters: {
            create: [
              {
                title: 'Welcome',
                videos: {
                  create: [
                    {
                      title: 'Welcome',
                      url: 'https://youtu.be/AfFpsCz-aoY',
                      description: 'The example video for introduce Meet-Troll',
                      material:
                        'https://drive.google.com/file/d/1Yq2bmgtDeFnc3ZoWfjgyzmJBz0OD4vTL',
                    },
                  ],
                },
              },
            ],
          },
        },
      })
      return res.status(201).json(create)
    } else if (req.method === 'PUT') {
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
        const update = await prisma.course.update({
          where: {
            id: courseId,
          },
          data: {
            title: data.title,
            description: data.description,
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
