// record 收集資料未來加上
// drag status start time
// youtube video length

export type InteractiveLog = [
  {
    status: 'play' | 'pause' | 'drag' | 'leave'
  }
]

export type EyeTrackingLog = {
  x: number
  y: number
  playerW: number
  playerH: number
}

export type ViewLog = {
  [playSecond: number]: EyeTrackingLog[]
}
