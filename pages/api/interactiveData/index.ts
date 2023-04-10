import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { courseId, videoId } = req.query as {
    courseId?: string
    videoId?: string
  }
  const isEmpty = (obj: {}): boolean => {
    return Object.keys(obj).length === 0
  }

  const isValidObjectId = (id: string): boolean => {
    return typeof id === 'string' && id.length === 24 && /^[a-f0-9]+$/i.test(id)
  }

  // 判斷登入
  if (session) {
    // GET DATA
    if (req.method === 'GET') {
    }
    if (req.method === 'POST') {
    }
    if (req.method === 'DELETE') {
      if (courseId && videoId) {
        if (isValidObjectId(courseId) && isValidObjectId(videoId)) {
          const check = await prisma.course.findUnique({
            where: {
              id: courseId,
            },
            select: {
              ownerId: true,
            },
          })
          if (check.ownerId.includes(session.user.id)) {
            try {
              await prisma.$transaction([
                prisma.choiceFeedback.deleteMany(),
                prisma.rankFeedback.deleteMany(),
                prisma.fillFeedback.deleteMany(),
                prisma.dragFeedback.deleteMany(),
              ])
            } catch (e) {
              console.error(e)
            } finally {
              await prisma.$disconnect()
            }
            return res.status(200).json('已刪除所有Feedback')
          } else {
            return res.status(403).json({ message: 'Forbidden' })
          }
        } else {
          return res.status(400).json({ message: 'Bad Request' })
        }
      } else {
        return res.status(400).json({ message: 'Bad Request' })
      }
    } else {
      return res.status(405).json({ message: 'Method Not Allowedbad request' })
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export default handler
