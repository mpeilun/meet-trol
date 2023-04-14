import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { ViewLog } from '@prisma/client'

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
            records: {
              select: {
                courseId: true,
                pastView: {
                  select: {
                    videoId: true,
                    viewLogs: true,
                  },
                },
              },
            },
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

          if (videoList.includes(videoId)) {
            // 建立 pastView 資料

            const pastView = await prisma.pastView.findFirst({
              where: {
                videoId: videoId,
                recordId: record.id,
              },
            })
            if (pastView) {
              const data = await prisma.pastView.findFirst({
                where: {
                  videoId: videoId,
                  record: {
                    id: record.id,
                  },
                },
                select: {
                  viewLogs: true,
                },
              })
              return res.status(200).json(data.viewLogs)
            } else {
              return res.status(400).json([])
            }
          } else {
            return res.status(400).json({ message: 'Bad Request' })
          }
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
                  viewLogs: true,
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
      const { lastPlaySecond } = req.body as { lastPlaySecond: number }
      const { eyesTrack, pauseTimes, dragTimes, watchTime, interactionLog } =
        req.body as ViewLog
      if (
        lastPlaySecond != null &&
        eyesTrack &&
        pauseTimes &&
        dragTimes &&
        watchTime &&
        interactionLog &&
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

        if (videoList.includes(videoId)) {
          // 建立 pastView 資料

          const pastView = await prisma.pastView.findFirst({
            where: {
              videoId: videoId,
              recordId: record.id,
            },
          })
          if (pastView) {
            await prisma.pastView.update({
              where: {
                id: pastView.id,
              },
              data: {
                lastPlaySecond: lastPlaySecond,
                lastViewTime: new Date(),
              },
            })
            const data = await prisma.viewLog.create({
              data: {
                eyesTrack: eyesTrack,
                pauseTimes: pauseTimes,
                dragTimes: dragTimes,
                watchTime: watchTime,
                interactionLog: interactionLog,
                PastView: {
                  connect: {
                    id: pastView.id,
                  },
                },
              },
            })
            return res.status(200).json(data)
          } else {
            const pastView = await prisma.pastView.create({
              data: {
                videoId: videoId,
                lastPlaySecond: lastPlaySecond,
                lastViewTime: new Date(),
                record: {
                  connect: {
                    id: record.id,
                  },
                },
              },
            })
            const data = await prisma.viewLog.create({
              data: {
                eyesTrack: eyesTrack,
                pauseTimes: pauseTimes,
                dragTimes: dragTimes,
                watchTime: watchTime,
                interactionLog: interactionLog,
                PastView: {
                  connect: {
                    id: pastView.id,
                  },
                },
              },
            })
            return res.status(200).json(data)
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
