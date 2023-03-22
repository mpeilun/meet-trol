import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Course } from '@prisma/client'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { courseId } = req.query as { courseId: string }

  if (req.method === 'GET') {
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

    res.status(200).json({
      ...courses,
      message: 'Success',
    })
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

// export default handler

// import { NextApiRequest, NextApiResponse } from 'next'
// import prisma from '../../../prisma/prisma'
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '../auth/[...nextauth]'
// import { Course } from '@prisma/client'

// async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const session = await getServerSession(req, res, authOptions)
//   const { courseId } = req.query as { courseId: string }

//   if (req.method === 'GET') {
//     const courses = await prisma.course.findMany({
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         createdAt: true,
//         updatedAt: true,
//         ownerId: true,
//       },
//     })

//     res.status(200).json({
//       ...courses,
//       message: 'Success',
//     })
//   } else if (req.method === 'DELETE') {
//     if (session) {
//       const data: Course = req.body
//       const check = await prisma.course.findUnique({
//         where: {
//           id: courseId,
//         },
//         select: {
//           ownerId: true,
//         },
//       })
//       if (check.ownerId.includes(session.user.id)) {
//         const update = await prisma.course.delete({
//           where: {
//             id: courseId,
//           },
//         })

//         res.status(201).json(update)
//       } else {
//         res.status(403).json({ message: 'Forbidden' })
//       }
//     } else {
//       res.status(401).json({ message: 'Unauthorized' })
//     }
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' })
//   }
// }

// export default handler
