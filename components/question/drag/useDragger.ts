import React, { useEffect, useRef } from 'react'

const useDragger = (id: string): void => {
  const isClicked = useRef<boolean>(false)

  const emptyRef = useRef()
  const coords = useRef<{
    startX: number
    startY: number
    lastX: number
    lastY: number
  }>({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  })
  useEffect(() => {
    // if (!isReply) {
    //   if (!boxRef.current || !buttonRef.current) return
    //   if (isReply) return

    const target = document.getElementById(id)
    if (!target) throw new Error("Element doesn't exist")

    const box = target.parentElement
    if (!box) throw new Error('Target element must have a parent')
    // const button = buttonRef.current

    const onMouseDown = (e: MouseEvent) => {
      isClicked.current = true
      coords.current.lastX = target.offsetLeft
      coords.current.lastY = target.offsetTop
      coords.current.startX = e.clientX
      coords.current.startY = e.clientY
    }

    const onMouseUp = (e: MouseEvent) => {
      isClicked.current = false
      coords.current.lastX = target.offsetLeft
      coords.current.lastY = target.offsetTop
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isClicked.current) return

      // 修正 button 在畫面上的 XY 軸
      // 要扣掉原本 button 所在的 XY 值
      const nextX = e.clientX - coords.current.startX + coords.current.lastX
      const nextY = e.clientY - coords.current.startY + coords.current.lastY

      target.style.top = `${nextY}px`
      target.style.left = `${nextX}px`
    }

    target.addEventListener('mousedown', onMouseDown)
    target.addEventListener('mouseup', onMouseUp)
    box.addEventListener('mousemove', onMouseMove)
    box.addEventListener('mouseleave', onMouseUp)

    const cleanup = () => {
      target.removeEventListener('mousedown', onMouseDown)
      target.removeEventListener('mouseup', onMouseUp)
      box.removeEventListener('mousemove', onMouseMove)
      box.removeEventListener('mouseleave', onMouseUp)
    }
    //  30, 140
    //  210, 170
    return cleanup
    // }
  }, [id])
}
export default useDragger
