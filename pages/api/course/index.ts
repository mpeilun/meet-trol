import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Course } from '@prisma/client'
import { CourseCreateType } from '../../../types/course'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { courseId, myCourse, owner } = req.query as {
    courseId?: string
    myCourse?: boolean
    owner?: boolean
  }

  //公開課程列表
  if (req.method == 'GET' && !myCourse && !owner && !courseId) {
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
    const coursesWithOwnerData = await Promise.all(
      courses.map(async (course) => {
        const owners = await prisma.user.findMany({
          where: {
            id: {
              in: course.ownerId,
            },
          },
        })

        const courseWithOwnerData = {
          ...course,
          owners: owners,
        }

        return courseWithOwnerData
      })
    )

    return res.status(200).json(coursesWithOwnerData)
  }

  //判斷是否登入
  if (session) {
    if (req.method === 'GET' && courseId) {
      const course = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        include: {
          chapters: {
            include: {
              videos: true,
            },
          },
        },
      })

      const owners = await prisma.user.findMany({
        where: {
          id: {
            in: course.ownerId,
          },
        },
      })

      if (course.ownerId.includes(session.user.id)) {
        return res.status(200).json({ ...course, owners: owners })
      } else {
        return res.status(403).json({ message: 'Forbidden' })
      }
    } else if (req.method === 'GET' && owner) {
      const session = await getServerSession(req, res, authOptions)

      const courses = await prisma.course.findMany({
        where: {
          ownerId: {
            has: session.user.id,
          },
        },
        include: {
          chapters: {
            include: {
              videos: true,
            },
          },
        },
      })

      const coursesWithOwnerData = await Promise.all(
        courses.map(async (course) => {
          const owners = await prisma.user.findMany({
            where: {
              id: {
                in: course.ownerId,
              },
            },
          })

          const courseWithOwnerData = {
            ...course,
            owners: owners,
          }

          return courseWithOwnerData
        })
      )

      return res.status(200).json(coursesWithOwnerData)
    }

    if (req.method === 'GET') {
      const session = await getServerSession(req, res, authOptions)

      const courses = await prisma.course.findMany({
        where: {
          membersId: {
            has: session.user.id,
          },
        },
      })

      const coursesWithOwnerData = await Promise.all(
        courses.map(async (course) => {
          const owners = await prisma.user.findMany({
            where: {
              id: {
                in: course.ownerId,
              },
            },
          })

          const courseWithOwnerData = {
            ...course,
            owners: owners,
          }

          return courseWithOwnerData
        })
      )

      return res.status(200).json(coursesWithOwnerData)
    } else if (req.method === 'POST') {
      const data: CourseCreateType = JSON.parse(req.body)
      console.log(data.title)
      const create = await prisma.course.create({
        data: {
          title: data.title,
          description: data.description,
          start: data.start,
          end: data.end,
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
