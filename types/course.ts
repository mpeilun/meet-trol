import { Course as PrismaCourse } from '@prisma/client'
import { Chapter as PrismaChapter } from '@prisma/client'
import { Video as PrismaVideo } from '@prisma/client'
import { User as PrismaUser } from '@prisma/client'
export interface CourseCreateType
  extends Omit<PrismaCourse, 'id' | 'create_At' | 'update_At' | 'membersId'> {}

export interface CourseWithDetail extends PrismaCourse {
  chapters: ChapterWithDetail[]
}

export interface CourseWithOwner extends PrismaCourse {
  owners: PrismaUser[]
}

export interface ChapterWithDetail extends PrismaChapter {
  videos: PrismaVideo[]
}
