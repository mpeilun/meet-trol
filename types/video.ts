import { Video as PrismaVideo } from '@prisma/client'

export interface VideoCreateType extends Omit<PrismaVideo, 'id'> {}
