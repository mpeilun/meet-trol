// import { NextApiRequest, NextApiResponse } from 'next'
// import prisma from '../../../prisma/prisma'

// async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'DELETE') {
//     const data = JSON.parse(req.body)
//     const deleteCourse = await prisma.course.delete({
//       where: { id: data.id },
//     })
//     res.status(200).json(deleteCourse)
//   } else if (req.method === 'POST') {
//     const data = req.body
//     const createCourse = await prisma.course.create({
//       data: {
//         ...data,
//       },
//     })
//     res.status(200).json(createCourse)
//   } else if (req.method === 'GET') {
//     const data = await prisma.course.findMany({})
//     res.status(200).json(data)
//   } else {
//     res.status(405).json({ message: 'Method not allowed' })
//   }
// }

// export default handler

import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Course } from '@prisma/client'
import { CourseCreateType } from '../../../types/course'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { courseId } = req.query as { courseId: string }

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

      //Return Type Course[]
      res.status(200).json({
        ...courses,
        message: 'Success',
      })
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
      res.status(201).json(create)
    } else if (req.method === 'PUT') {
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

        res.status(201).json(update)
      } else {
        res.status(403).json({ message: 'Forbidden' })
      }
    } else if (req.method === 'DELETE') {
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

        res.status(204).json(update)
      } else {
        res.status(403).json({ message: 'Forbidden' })
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' })
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export default handler
