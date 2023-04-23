// record 收集資料未來加上
// drag status start time
// youtube video length
import { ChoiceOption, Position, WatchTime } from '@prisma/client'

type Action = {
  status:
    | 'play-background'
    | 'play'
    | 'pause'
    | 'drag'
    | 'enter'
    | 'leave'
    | 'openInteraction'
    | 'closeInteraction'
    | 'submitAnswer'
  playSecond?: number
  questionId?: string
  focusTime?: number
  isCorrect?: boolean
  x?: number
  y?: number
}

export type EyeTrackingLog = {
  x: number
  y: number
  playerW: number
  playerH: number
}

export type ViewLog = {
  [playSecond: number]: EyeTrackingLog[]
}

export type AnalyticsLog = {
  [dateTime: string]: Action
}
export type UserAnalyticsLog = {
  [userId: string]: AnalyticsLog[]
}

export type InteractionAction = {
  questionId: string // 題目id
  questionType: string // 題目類型
  answerTimes?: number // 作答次數
  correctRate?: number // 正確率
  openInteractionTimes: number // 開啟次數
  focusOnInteractionLength: number // 題目焦點時長
  totalOpenLength: number // 題目閱讀時長 卡片開啟時長
  isFirstInAnswer?: boolean // 第一次開就作答
}

export type InteractionLog = {
  userId: string
  email: string
  name: string
  totalStayTime: number // 總停留時長
  totalVideoPlayLength: number // 影片撥放總時間
  totalVideoPlayFrontLength: number // 總影片前景播放時間(有在網頁中，播放的時間)
  totalVideoPlayBackLength: number //總影片背景播放時間(播放時沒有在此網頁)
  totalVideoPauseLength: number // 總影片總暫停時長 (包含閱讀題目)
  totalVideoFocusLength: number // 總影片總焦點時長
  totalInteractionLength: number // 全部互動卡片開啟時長
  totalOpenInteractionTimes: number // 全部互動卡片開啟次數
  totalFocusOnInteractionLength: number // 總題目焦點時長
  totalQuestionCorrectRate: number // 總題目正確率
  pauseTimes: number // 暫停次數
  dragTimes: number // 重播次數
  enterWebTime: string // 進入網站時間
  videoStartTime: string // 開始觀看影片時間
  enterPreFormTime: string // 開始填寫前測問卷時間
  enterPostFormTime: string // 開始填寫後測問卷時間
  info1_questionId: string
  info1_questionType: string
  info1_openInteractionTimes: number
  info1_focusOnInteractionLength: number
  info1_totalOpenLength: number
  info2_questionId: string
  info2_questionType: string
  info2_openInteractionTimes: number
  info2_focusOnInteractionLength: number
  info2_totalOpenLength: number
  choice1_questionId: string
  choice1_questionType: string
  choice1_answerTimes?: number
  choice1_correctRate?: number
  choice1_openInteractionTimes: number
  choice1_focusOnInteractionLength: number
  choice1_totalOpenLength: number
  choice1_isFirstInAnswer?: boolean
  choice2_questionId: string
  choice2_questionType: string
  choice2_answerTimes?: number
  choice2_correctRate?: number
  choice2_openInteractionTimes: number
  choice2_focusOnInteractionLength: number
  choice2_totalOpenLength: number
  choice2_isFirstInAnswer?: boolean
  rank_questionId: string
  rank_questionType: string
  rank_answerTimes?: number
  rank_correctRate?: number
  rank_openInteractionTimes: number
  rank_focusOnInteractionLength: number
  rank_totalOpenLength: number
  rank_isFirstInAnswer?: boolean
  fill_questionId: string
  fill_questionType: string
  fill_answerTimes?: number
  fill_correctRate?: number
  fill_openInteractionTimes: number
  fill_focusOnInteractionLength: number
  fill_totalOpenLength: number
  fill_isFirstInAnswer?: boolean
  drag_questionId: string
  drag_questionType: string
  drag_answerTimes?: number
  drag_correctRate?: number
  drag_openInteractionTimes: number
  drag_focusOnInteractionLength: number
  drag_totalOpenLength: number
  drag_isFirstInAnswer?: boolean
  // interactionActions: InteractionAction[]
}

type choice = {
  id: string
  feedback: {
    createdAt: Date
    answers: number[]
  }[]
  options: ChoiceOption[]
  questionType: string
}
type rank = {
  id: string
  feedback: {
    createdAt: Date
    answers: string[]
  }[]
  options: string[]
  questionType: string
}
type fill = {
  id: string
  feedback: {
    createdAt: Date
    answers: string[]
  }[]
  questionType: string
  question: string
}

type drag = {
  id: string
  feedback: {
    createdAt: Date
    answers: Position[]
  }[]
  options: Position[]
  questionType: string
}
export type allInteractionType = choice | rank | fill | drag
