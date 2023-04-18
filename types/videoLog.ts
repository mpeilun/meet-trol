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
  totalVideoWatchTime: number // 影片撥放總時間
  totalOnVideoWatchTime: number // 總影片前景播放時間(有在網頁中，播放的時間)
  totalOutVideoWatchTime: number //總影片背景播放時間(播放時沒有在此網頁)
  totalVideoPauseTime: number // 總影片總暫停時長 (包含閱讀題目)
  totalVideoFocusTime: number // 總影片總焦點時長
  totalInteractionTime: number // 總開啟互動卡片時長
  totalFocusOnInteractionTime: number // 總題目焦點時長
  pauseTimes: number // 暫停次數
  replayTimes: number // 重播次數
  enterWebTime: string // 進入網站時間
  enterPreFormTime: string // 開始填寫前置問卷時間
  videoStartTime: string // 開始觀看影片時間
  enterPostTime: string // 開始填寫後測問卷時間
  interactionActions: InteractionAction[]
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
