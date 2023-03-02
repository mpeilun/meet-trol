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

export interface InteractionData {
  url: string
  info: Info[]
  choice: ChoiceData[]
  rank: RankData[]
  fill: FillData[]
  drag: DragData[]
}
interface ChoiceData extends Choice {
  feedback: ChoiceFeedback[]
}
interface RankData extends Rank {
  feedback: RankFeedback[]
}
interface FillData extends Fill {
  feedback: FillFeedback[]
}
interface DragData extends Drag {
  feedback: DragFeedback[]
}

interface LastViewData {
  videoId: string
  videoTime: number
  viewTime: string
}
