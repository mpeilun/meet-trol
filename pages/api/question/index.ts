import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'
import { Question, Video } from '../../../types/video-edit'
import { checkQuestionType } from '../../../util/common'
import { Choice, Drag, Fill, Info, Rank } from '.prisma/client'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  //判斷是否登入
  if (session) {
    //判斷 Method 為 POST
    if (req.method === 'POST') {
      let { question } = req.body as { question: Question }
      const video = await prisma.video.findUnique({
        where: { id: question.videoId },
        select: {
          chapter: {
            select: {
              course: {
                select: {
                  ownerId: true,
                },
              },
            },
          },
        },
      })
      if (video.chapter.course.ownerId.includes(session.user.id)) {
        switch (question.questionType) {
          //Info
          case 'info':
            const info = await prisma.info.create({
              data: {
                ...(question as Info),
              },
            })
            res.status(200).json(info)
            break
          //Choice
          case 'choice':
            const choice = await prisma.choice.create({
              data: {
                ...(question as Choice),
              },
            })
            res.status(200).json(choice)
            break
          //Fill
          case 'fill':
            const fill = await prisma.fill.create({
              data: {
                ...(question as Fill),
              },
            })
            res.status(200).json(fill)
            break
          //Drag
          case 'drag':
            const drag = await prisma.drag.create({
              data: {
                ...(question as Drag),
              },
            })
            res.status(200).json(drag)
            break
          //Rank
          case 'rank':
            const rank = await prisma.rank.create({
              data: {
                ...(question as Rank),
              },
            })
            res.status(200).json(rank)
            break
          default:
            res.status(404).json({ message: 'Error Question Type' })
        }
      } else {
        res.status(403).json({ message: 'Forbidden' })
      }
      //判斷 Method 為 PUT
    } else if (req.method === 'PUT') {
      let { question } = req.body as { question: Question }
      const video = await prisma.video.findUnique({
        where: { id: question.videoId },
        select: {
          chapter: {
            select: {
              course: {
                select: {
                  ownerId: true,
                },
              },
            },
          },
        },
      })
      if (video.chapter.course.ownerId.includes(session.user.id)) {
        const { id, ...questionDropId } = question

        switch (question.questionType) {
          //Info
          case 'info':
            const info = await prisma.info.update({
              where: { id: question.id },
              data: {
                ...(questionDropId as Info),
              },
            })
            // const updateInfo = await prisma.video.update({
            //   where: { id: question.videoId },
            //   data: {
            //     [question.questionType]: {
            //       connect: {
            //         id: info.id,
            //       },
            //     },
            //   },
            // })
            res.status(200).json(info)
            break
          //Choice
          case 'choice':
            const choice = await prisma.choice.update({
              where: { id: question.id },
              data: {
                ...(questionDropId as Choice),
              },
            })
            // const updateChoice = await prisma.video.update({
            //   where: { id: question.videoId },
            //   data: {
            //     [question.questionType]: {
            //       connect: {
            //         id: choice.id,
            //       },
            //     },
            //   },
            // })
            res.status(200).json(choice)
            break
          //Fill
          case 'fill':
            const fill = await prisma.fill.update({
              where: { id: question.id },
              data: {
                ...(questionDropId as Fill),
              },
            })
            // const updateFill = await prisma.video.update({
            //   where: { id: question.videoId },
            //   data: {
            //     [question.questionType]: {
            //       connect: {
            //         id: fill.id,
            //       },
            //     },
            //   },
            // })
            res.status(200).json(fill)
            break
          //Drag
          case 'drag':
            const drag = await prisma.drag.update({
              where: { id: question.id },
              data: {
                ...(questionDropId as Drag),
              },
            })
            // const updateDrag = await prisma.video.update({
            //   where: { id: question.videoId },
            //   data: {
            //     [question.questionType]: {
            //       connect: {
            //         id: drag.id,
            //       },
            //     },
            //   },
            // })
            res.status(200).json(drag)
            break
          //Rank
          case 'rank':
            const rank = await prisma.rank.update({
              where: { id: question.id },
              data: {
                ...(questionDropId as Rank),
              },
            })
            // const updateRank = await prisma.video.update({
            //   where: { id: question.videoId },
            //   data: {
            //     [question.questionType]: {
            //       connect: {
            //         id: rank.id,
            //       },
            //     },
            //   },
            // })
            res.status(200).json(rank)
            break
          default:
            res.status(404).json({ message: 'Error Question Type' })
        }
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
