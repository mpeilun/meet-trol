import {
  Video as VideoPrisma,
  Chapter as ChapterPrisma,
  Info,
  Choice,
  Rank,
  Fill,
  Drag,
  Course,
} from '@prisma/client'

export interface Chapter extends ChapterPrisma {
  course: Course
}

export interface Video extends VideoPrisma {
  question: (Info | Choice | Rank | Fill | Drag)[]
  chapter: Chapter
}
