import { EyeTrackingLog } from '../types/videoLog'


interface transformXY {
  x: number
  y: number
  playerX: number
  playerY: number
  playerW: number
  playerH: number
  widthRate?: number
  heightRate?: number
}

// 將眼動儀座標換算成影片座標 排除黑邊
export const transformXY = ({ x, y, playerX, playerY, playerW, playerH, widthRate = 16, heightRate = 9 }: transformXY): EyeTrackingLog => {
  const { newPlayerX, newPlayerY, newPlayerW, newPlayerH } = calculateXY( playerX, playerY, playerW, playerH, widthRate, heightRate )
  // 判斷是否注視在影像上
  if (
    x >= newPlayerX &&
    x <= newPlayerX + newPlayerW &&
    y >= newPlayerY &&
    y <= newPlayerY + newPlayerH
  ) {
    return { x: Math.round(x - newPlayerX), y: Math.round(y - newPlayerY), playerW: newPlayerW, playerH: newPlayerH}
  }
}

export const isFocusOnVideo = ({ x, y, playerX, playerY, playerW, playerH, widthRate = 16, heightRate = 9 }: transformXY): boolean => {
  const { newPlayerX, newPlayerY, newPlayerW, newPlayerH } = calculateXY( playerX, playerY, playerW, playerH, widthRate, heightRate)
  if (
    x >= newPlayerX &&
    x <= newPlayerX + newPlayerW &&
    y >= newPlayerY &&
    y <= newPlayerY + newPlayerH
  ) {
    return true
  } else {
    return false
  }
}

// 計算影像在播放器上的實際座標和大小
export const calculateXY = ( playerX: number, playerY: number, playerW: number, playerH: number, widthRate: number = 16, heightRate: number = 9)
: { newPlayerX: number, newPlayerY: number, newPlayerW: number, newPlayerH: number} => {
  const ratio = widthRate / heightRate
  // 寬 > 高 => 左右兩邊出現黑邊
  if (playerW / playerH > ratio) {
    const newPlayerW = playerH * ratio
    const diff = playerW - newPlayerW
    const newPlayerX = playerX + diff / 2
    return { newPlayerX: newPlayerX, newPlayerY: playerY, newPlayerW: newPlayerW, newPlayerH: playerH }
  } // 高 > 寬 => 上下兩邊出現黑邊
  else if (playerW / playerH < ratio) {
    const newPlayerH = playerW / ratio
    const diff = playerH - newPlayerH
    const newPlayerY = playerY + diff / 2
    return { newPlayerX: playerY, newPlayerY: newPlayerY, newPlayerW: playerW, newPlayerH: newPlayerH }
  } else {
    return { newPlayerX: playerX, newPlayerY: playerY, newPlayerW: playerW, newPlayerH: playerH }
  }
}

// 重新計算新的播放器 XY 座標
export const scaleXY = ( x: number, y: number, playerW: number, playerH: number, toPlayerW: number, toPlayerH: number
) => {
  const xRate = toPlayerW / playerW
  const yRate = toPlayerH / playerH
  return {
    x: Math.round(x * xRate),
    y: Math.round(y * yRate),
  }
}
