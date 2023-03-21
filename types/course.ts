import { Course as PrismaCourse } from '@prisma/client'

export interface CourseCreateType
  extends Omit<
    PrismaCourse,
    'id' | 'create_At' | 'update_At' | 'membersId' | 'ownerId'
  > {}
