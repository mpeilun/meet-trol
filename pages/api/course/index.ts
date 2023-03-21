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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  //判斷是否登入
  const session = await getServerSession(req, res, authOptions)
  //GET 取得已加入課程列表
  if (session) {
    if (req.method === 'GET') {
      const session = await getServerSession(req, res, authOptions)

      const data = await prisma.course.findMany({
        where: {
          membersId: {
            has: session.user.id,
          },
        },
      })

      //Return Type Course[]
      res.status(201).json({
        ...data,
        message: 'Success',
      })
    } else if (req.method === 'POST') {
      const data: Omit<Course, 'id' | 'create_At' | 'update_At' | 'membersId'> =
        req.body
      const createCourse = await prisma.course.create({
        data: {
          ...data,
        },
      })
      res.status(200).json(createCourse)
    } else if (req.method === 'PUT') {
      const data = req.body
    } else if (req.method === 'DELETE') {
    } else {
      res.status(405).json({ message: 'Method Not Allowed' })
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export default handler
