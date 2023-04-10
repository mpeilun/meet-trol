import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'

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
      // 判斷是否有query
      if (isEmpty(req.query)) {
        const data = await prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
          select: {
            records: true,
          },
        })
        return res.status(200).json(data)
      }
      // 判斷是否有courseId和videoId
      else if (courseId && videoId) {
        // 判斷courseId和videoId是否為objectId
        if (isValidObjectId(courseId) && isValidObjectId(videoId)) {
          const record = await prisma.record.findFirst({
            where: {
              courseId: courseId,
              userId: session.user.id,
            },
            select: { id: true },
          })
          const data = await prisma.pastView.findFirst({
            where: {
              videoId: videoId,
              record: {
                id: record.id,
              },
            },
            select: {
              videoId: true,
              lastPlaySecond: true,
              lastViewTime: true,
            },
          })
          return res.status(200).json(data)
        } else {
          return res.status(400).json({ message: 'Bad Request' })
        }
      }
      // 判斷是否有courseId
      else if (courseId) {
        // 判斷courseId是否為objectId
        if (isValidObjectId(courseId)) {
          const data = await prisma.record.findFirst({
            where: {
              courseId: courseId,
              userId: session.user.id,
            },
            select: {
              pastView: {
                select: {
                  videoId: true,
                  lastPlaySecond: true,
                  lastViewTime: true,
                },
              },
            },
          })
          return res.status(200).json(data.pastView)
        } else {
          return res.status(400).json({ message: 'Bad Request' })
        }
      } else {
        return res.status(400).json({ message: 'Bad Request' })
      }
    }
    if (req.method === 'POST') {
      const { videoTime } = req.body as { videoTime: number }
      if (
        videoTime != null &&
        isValidObjectId(courseId) &&
        isValidObjectId(videoId)
      ) {
        const record = await prisma.record.findFirst({
          where: {
            courseId: courseId,
            userId: session.user.id,
          },
          select: {
            id: true,
          },
        })

        const videos = await prisma.course.findUnique({
          where: {
            id: courseId,
          },
          select: {
            chapters: {
              select: {
                videos: { select: { id: true } },
              },
            },
          },
        })
        // 建立課程 video 資料
        const videoList = videos.chapters
          .map(({ videos }) => videos.map(({ id }) => id))
          .flat()
        // 判斷 video 在 course 裡面
        if (videoList.includes(videoId)) {
          const data = await prisma.pastView.upsert({
            where: {
              videoId: videoId,
            },
            update: {
              lastPlaySecond: videoTime,
              lastViewTime: new Date(),
            },
            create: {
              videoId: videoId,
              lastPlaySecond: videoTime,
              lastViewTime: new Date(),
              record: {
                connect: {
                  id: record.id,
                },
              },
            },
          })
          return res.status(200).json(data)
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
