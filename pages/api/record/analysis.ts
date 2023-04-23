import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'
import {
  AnalysisLogs,
  Logs,
  EyeTrackLogs,
  ActionLogs,
} from '../../../types/videoLog'

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
      if (courseId && videoId) {
        // 判斷courseId和videoId是否為objectId
        if (isValidObjectId(courseId) && isValidObjectId(videoId)) {
          const course = await prisma.course.findUnique({
            where: {
              id: courseId,
            },
            select: {
              ownerId: true,
              chapters: {
                select: {
                  videos: {
                    where: {
                      id: videoId,
                    },
                    select: {
                      info: true,
                      choice: { include: { feedback: true } },
                      rank: { include: { feedback: true } },
                      fill: { include: { feedback: true } },
                      drag: { include: { feedback: true } },
                    },
                  },
                },
              },
            },
          })


          // 返回全部
          if (course.ownerId.includes(session.user.id)) {
            const analysisLogs: AnalysisLogs = {}
            const logs: Logs[] = []
            const actionLogs: ActionLogs = {}
            const eyeTrackLogs: EyeTrackLogs = {}
            const allUserData = await prisma.user.findMany({
              where: {
                records: {
                  some: {
                    courseId: courseId,
                    pastView: {
                      some: {
                        videoId: videoId,
                        viewLogs: {
                          some: {
                            pastViewId: {
                              not: null,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              select: {
                id: true,
                name: true,
                email: true,
                records: {
                  select: {
                    pastView: {
                      select: {
                        viewLogs: true,
                      },
                    },
                  },
                },
              },
            })
            

            const feedback = await Promise.all(
              allUserData.map(async ({ id, name, email, records }) => {
                const viewLogs = records[0].pastView[0].viewLogs
                const feedback = await Promise.all(
                  viewLogs.map(async (log) => {
                    // 進入頁面時間
                    const enterVideoTime = log.watchTime.start.time
                    // 離開頁面時間
                    const leaveVideoTime = log.watchTime.end.time
                    

                  })
                )
                return feedback
              })
            )

            return res.status(200).json(feedback)
          }
          // 沒有權限返回個人LOG
          else {
            // const Logs: Logs = {}
            // const pastView = await prisma.viewLog.findMany({
            //   where: {
            //     PastView: {
            //       videoId: videoId,
            //       record: {
            //         userId: session.user.id,
            //       },
            //     },
            //   },
            // })
            // const videoInteraction = await prisma.video.findUnique({
            //   where: {
            //     id: videoId,
            //   },
            //   select: {
            //     choice: {
            //       select: {
            //         id: true,
            //         questionType: true,
            //         options: true,
            //         feedback: {
            //           where: {
            //             userId: session.user.id,
            //             createdAt: {
            //               gte: enterVideoTime,
            //               lte: leaveVideoTime,
            //             },
            //           },
            //           select: {
            //             answers: true,
            //             createdAt: true,
            //           },
            //         },
            //       },
            //     },
            //     rank: {
            //       select: {
            //         id: true,
            //         questionType: true,
            //         options: true,
            //         feedback: {
            //           where: {
            //             userId: userId,
            //             createdAt: {
            //               gte: enterVideoTime,
            //               lte: leaveVideoTime,
            //             },
            //           },
            //           select: {
            //             answers: true,
            //             createdAt: true,
            //           },
            //         },
            //       },
            //     },
            //     fill: {
            //       select: {
            //         id: true,
            //         questionType: true,
            //         question: true,
            //         feedback: {
            //           where: {
            //             userId: userId,
            //             createdAt: {
            //               gte: enterVideoTime,
            //               lte: leaveVideoTime,
            //             },
            //           },
            //           select: {
            //             answers: true,
            //             createdAt: true,
            //           },
            //         },
            //       },
            //     },
            //     drag: {
            //       select: {
            //         id: true,
            //         questionType: true,
            //         options: true,
            //         feedback: {
            //           where: {
            //             userId: userId,
            //             createdAt: {
            //               gte: enterVideoTime,
            //               lte: leaveVideoTime,
            //             },
            //           },
            //           select: {
            //             answers: true,
            //             createdAt: true,
            //           },
            //         },
            //       },
            //     },
            //   },
            // })
            // return res.status(200).json(pastView)
          }
        } else {
          return res.status(400).json({ message: 'Bad Request' })
        }
      } else {
        return res.status(400).json({ message: 'Bad Request' })
      }
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export default handler
