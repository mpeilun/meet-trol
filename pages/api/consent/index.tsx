import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../api/auth/[...nextauth]'
import { InformedConsent } from '@prisma/client'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  //判斷是否登入
  if (session) {
    if (req.method === 'GET') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          informedConsent: true,
        },
      })
      if (user.informedConsent) {
        res.status(200).json({ message: 'Success' })
      } else {
        res.status(404).json({ message: 'Not Found' })
      }
    } else if (req.method === 'POST') {
      const { isAgree, isComplete } = JSON.parse(req.body) as InformedConsent
      const user = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          informedConsent: {
            create: {
              isAgree: isAgree,
              isComplete: isComplete,
            },
          },
        },
        select: {
          informedConsent: true,
        },
      })
      if (user.informedConsent) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: 'Error' })
      }
    } else if (req.method === 'PUT') {
      const { isAgree, isComplete } = req.body as InformedConsent
      const user = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          informedConsent: {
            update: {
              isAgree: isAgree,
              isComplete: isComplete,
            },
          },
        },
        select: {
          informedConsent: true,
        },
      })
      if (user) {
        res.status(200).json({ message: 'Update Success' })
      } else {
        res.status(403).json({ message: 'Forbidden' })
      }
    } else {
      res.status(404).json({ message: 'Error Method' })
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export default handler
