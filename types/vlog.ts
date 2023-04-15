// record 收集資料未來加上
// drag status start time
// youtube video length

type InteractiveLog = [
  {
    status: 'play' | 'pause' | 'drag' | 'leave'
  }
]

interface EyeTrackingLog {
    x: number;
    y: number;
    playerW: number;
    playerH: number;
  }
