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

export type Question = Info | Choice | Rank | Fill | Drag
export type allQuestion = (Info | Choice | Rank | Fill | Drag)[]
export interface Chapter extends ChapterPrisma {
  course: Course
}

export interface Video extends VideoPrisma {
  question: allQuestion
  chapter: Chapter
  message?: string
}
