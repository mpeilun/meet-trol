import { EyeTrackingLog } from '@/types/vlog'

// 將眼動儀座標換算成影片座標 排除黑邊

interface transformXY {
  x: number
  y: number
  playerX: number
  playerY: number
  playerW: number
  playerH: number
  windowX?: number
  windowY?: number
}
export const transformXY = ({
  x,
  y,
  playerX,
  playerY,
  playerW,
  playerH,
  windowX,
  windowY,
}: transformXY): EyeTrackingLog => {
  const ratio = 16 / 9
  // 寬 > 高
  if (playerW / playerH < ratio) {
    const newPlayerW = playerH * ratio
    const diff = newPlayerW - playerW
    const newPlayerX = playerX + diff / 2
    if (
      x >= newPlayerX &&
      x <= newPlayerX + newPlayerW &&
      y >= playerY &&
      y <= playerY + playerH
    ) {
      return {
        x: x - newPlayerX,
        y: y - playerY,
        playerW: newPlayerW,
        playerH: playerH,
      }
    }
  } // 高 > 寬
  else if (playerW / playerH > ratio) {
    const newPlayerH = playerW / ratio
    const diff = newPlayerH - playerH
    const newPlayerY = playerY + diff / 2
    if (
      x >= playerX &&
      x <= playerX + playerW &&
      y >= newPlayerY &&
      y <= newPlayerY + newPlayerH
    ) {
      return {
        x: x - playerX,
        y: y - newPlayerY,
        playerW: playerW,
        playerH: newPlayerH,
      }
    }
  } else {
    if (
      x >= playerX &&
      x <= playerX + playerW &&
      y >= playerY &&
      y <= playerY + playerH
    ) {
      return {
        x: x - playerX,
        y: y - playerY,
        playerW: playerW,
        playerH: playerH,
      }
    }
  }
}
