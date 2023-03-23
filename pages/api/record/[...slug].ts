import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query as { slug: string[] }
  const [courseId, videoId, ...result] = slug
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const isValidObjectId = (id: string): boolean => {
    return typeof id === 'string' && id.length === 24 && /^[a-f0-9]+$/i.test(id)
  }
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'GET') {
    if (session && isValidObjectId(courseId) && isValidObjectId(videoId)) {
      const record = await prisma.record.findMany({
        where: {
          courseId: courseId,
          userId: session.user.id,
        },
      })
      const data = await prisma.lastView.findMany({
        where: {
          videoId: videoId,
          record: {
            id: record[0].id,
          },
        },
        select: {
          videoId: true,
          videoTime: true,
          viewTime: true,
        },
      })
      res.status(200).json(data[0])
    } else {
      res.status(403).json({ message: 'forbidden' })
    }
  } else if (req.method === 'POST') {
    if (session && isValidObjectId) {
      const { videoTime } = req.body
      const record = await prisma.record.findMany({
        where: {
          courseId: courseId,
          userId: session.user.id,
        },
      })
      const lastView = await prisma.lastView.findMany({
        where: {
          videoId: videoId,
          record: {
            id: record[0].id,
          },
        },
        select: {
          id: true,
        },
      })
      const fakeId = '123456789012345678901234'
      const lastViewVideoIs = lastView.length==0 ? fakeId : lastView[0].id 
      const data = await prisma.lastView.upsert({
        where: {
          id: lastViewVideoIs,
        },
        update: {
          videoTime: videoTime,
          viewTime: new Date(),
        },
        create: {
          videoId: videoId,
          videoTime: videoTime,
          viewTime: new Date(),
          record: {
            connect: {
              id: record[0].id,
            },
          },
        },
      })
      console.log(videoTime)
      res.status(200).json(data)
    } else {
      res.status(403).json({ message: 'forbidden' })
    }
  } else {
    res.status(400).json({ message: 'bad request' })
  }
}

export default handler
