import {
  Chapter,
  Video,
  PastView,
  Info,
  Choice,
  ChoiceFeedback,
  Rank,
  RankFeedback,
  Fill,
  FillFeedback,
  Drag,
  DragFeedback,
} from '@prisma/client'

export interface ChapterListData {
  title: string
  videos: { id: string; title: string }[]
}

export interface VideoData extends Video {
  questions: (Info | ChoiceData | RankData | FillData | DragData)[]
}

export interface InteractionData {
  info: Info[]
  choice: ChoiceData[]
  rank: RankData[]
  fill: FillData[]
  drag: DragData[]
}

export interface ChoiceData extends Choice {
  feedback: ChoiceFeedback[]
}
export interface RankData extends Rank {
  feedback: RankFeedback[]
}
export interface FillData extends Fill {
  feedback: FillFeedback[]
}
export interface DragData extends Drag {
  feedback: DragFeedback[]
}

export interface PastViewData {
  videoId: string
  lastVideoTime: number
  lastViewTime: Date
}

export interface ChapterCreateType extends Omit<Chapter, 'id' | 'courseId'> {}
