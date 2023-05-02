import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'
import { Question, Video } from '../../../types/video-edit'
import { checkQuestionType } from '../../../util/common'
import { Choice, Drag, Fill, Info, Rank } from '.prisma/client'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { videoId } = req.query as {
    videoId?: string
  }
  const isValidObjectId = (id: string): boolean => {
    return typeof id === 'string' && id.length === 24 && /^[a-f0-9]+$/i.test(id)
  }
  //判斷是否登入
  if (session) {
    //判斷 Method 為 POST
    if (req.method === 'PUT') {
      if (isValidObjectId(videoId)) {
        const question = await prisma.video.findUnique({
          where: { id: videoId },
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
            choice: { include: { feedback: true } },
            drag: { include: { feedback: true } },
            fill: { include: { feedback: true } },
            rank: { include: { feedback: true } },
          },
        })
        // return res.status(200).json(question)

        if (question.chapter.course.ownerId.includes(session.user.id)) {
          //   const checkChoice = question.choice.map(async (choice) => {
          //     await Promise.all(
          //       choice.feedback.map(async ({ id, answers }) => {
          //         const correctAnswer = []
          //         choice.options.map(({ isAnswer }, index) => {
          //           if (isAnswer === true) {
          //             correctAnswer.push(index)
          //           }
          //         })
          //         const isCorrect = correctAnswer.every(
          //           (answer, index) => answer === answers[index]
          //         )
          //         await prisma.choiceFeedback.update({
          //           where: { id: id },
          //           data: { isCorrect: isCorrect },
          //         })
          //       })
          //     )
          //   })
          //   const checkRank = question.rank.map(async (rank) => {
          //     await Promise.all(
          //         rank.feedback.map(async ({ id, answers }) => {

          //         const isCorrect = rank.options.every(
          //           (answer, index) => answer === answers[index]
          //         )
          //         await prisma.rankFeedback.update({
          //           where: { id: id },
          //           data: { isCorrect: isCorrect },
          //         })
          //       })
          //     )
          //   })
          //   const checkFill = question.fill.map(async (fill) => {
          //     await Promise.all(
          //       fill.feedback.map(async ({ id, answers }) => {
          //         const regex = /(?<=\().+?(?=\))/g // 正則表達式 匹配所有括號內的文字
          //         const correctAnswer: string[] = fill.question.match(regex)
          //         const isCorrect = correctAnswer.every(
          //           (answer, index) => answer === answers[index]
          //         )
          //         await prisma.fillFeedback.update({
          //           where: { id: id },
          //           data: { isCorrect: isCorrect },
          //         })
          //       })
          //     )
          //   })
          //   const checkDrag = question.drag.map(async (drag) => {
          //     await Promise.all(
          //       drag.feedback.map(async ({ id, answers }) => {
          //         const x = drag.options[0].x
          //         const y = drag.options[0].y
          //         const width = drag.options[0].width
          //         const height = drag.options[0].height
          //         const isCorrect =
          //           answers[0].x >= x &&
          //           answers[0].x <= x + width &&
          //           answers[0].y >= y &&
          //           answers[0].y <= y + height
          //         console.log(isCorrect)

          //         await prisma.dragFeedback.update({
          //           where: { id: id },
          //           data: { isCorrect: isCorrect },
          //         })
          //       })
          //     )
          //   })
          //   await Promise.all([checkChoice, checkRank, checkFill, checkDrag])
          //   await Promise.all(checkDrag)
          return res.status(200).json('success')
        } else {
          res.status(403).json({ message: 'Forbidden' })
        }
      } else {
        return res.status(400).json({ message: 'Bad Request' })
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' })
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export default handler
