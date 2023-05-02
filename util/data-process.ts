import { EyeTrack, ViewLog } from '../types/videoLog'

class KalmanFilter {
  private A: number // 状态转移矩阵
  private H: number // 观测矩阵
  private Q: number // 状态噪声方差
  private R: number // 观测噪声方差
  private P: number // 先验误差协方差矩阵
  private x: number // 状态向量

  constructor(
    A: number,
    H: number,
    Q: number,
    R: number,
    P: number,
    x: number
  ) {
    this.A = A
    this.H = H
    this.Q = Q
    this.R = R
    this.P = P
    this.x = x
  }

  predict() {
    // 预测
    this.x = this.A * this.x
    this.P = this.A * this.P * this.A + this.Q
    return this.x
  }

  update(z: number) {
    // 更新
    const K = (this.P * this.H) / (this.H * this.P * this.H + this.R)
    this.x = this.x + K * (z - this.H * this.x)
    this.P = (1 - K * this.H) * this.P
    return this.x
  }
}

export function smoothData(
  data: EyeTrack[],
  Q: number,
  R: number
): EyeTrack[] {
  const kfX = new KalmanFilter(1, 1, Q, R, 1, data[0].x)
  const kfY = new KalmanFilter(1, 1, Q, R, 1, data[0].y)
  const result: EyeTrack[] = []
  for (let i = 0; i < data.length; i++) {
    const x = kfX.predict()
    const y = kfY.predict()
    kfX.update(data[i].x)
    kfY.update(data[i].y)
    result.push({ x, y, playerW: data[i].playerW, playerH: data[i].playerH })
  }
  return result
}

export function calculateCenterCoordinate(
  logs: { x: number; y: number; value: number }[]
): {
  avgX: number
  avgY: number
  medianX: number
  medianY: number
} {
  const n = logs.length
  if (n === 0) {
    return { avgX: 0, avgY: 0, medianX: 0, medianY: 0 }
  }

  // 計算平均值
  let sumX = 0
  let sumY = 0
  logs.forEach((log) => {
    sumX += log.x
    sumY += log.y
  })
  const avgX = sumX / n
  const avgY = sumY / n

  // 計算中位數
  logs.sort((a, b) => a.x - b.x)
  const medianX =
    n % 2 === 0
      ? (logs[n / 2 - 1].x + logs[n / 2].x) / 2
      : logs[Math.floor(n / 2)].x
  logs.sort((a, b) => a.y - b.y)
  const medianY =
    n % 2 === 0
      ? (logs[n / 2 - 1].y + logs[n / 2].y) / 2
      : logs[Math.floor(n / 2)].y

  return { avgX, avgY, medianX, medianY }
}
