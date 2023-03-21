import {
  Chapter,
  Video,
  LastView,
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
  question: (Info | ChoiceData | RankData | FillData | DragData)[]
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

export interface LastViewData {
  videoId: string
  videoTime: number
  viewTime: string
}
