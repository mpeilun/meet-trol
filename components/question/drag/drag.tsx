import { Box, Typography, IconButton, Divider } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CloseIcon from '@mui/icons-material/Close'

import React, { useEffect, useRef, useState } from 'react'
import { height } from '@mui/system'

const Drag = (props: { handleQuestionClose: () => void }) => {
  const boxRef = useRef(null)
  const buttonRef = useRef(null)
  const isClicked = useRef<boolean>(false)

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

  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    if (!boxRef.current || !buttonRef.current) return

    const box = boxRef.current
    const button = buttonRef.current

    const check = (x: number, y: number) => {
      if (x > 30 && x < 215 && y > 145 && y < 175) {
        setIsCorrect(true)
      } else {
        setIsCorrect(false)
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      isClicked.current = true
      coords.current.lastX = button.offsetLeft
      coords.current.lastY = button.offsetTop
      coords.current.startX = e.clientX
      coords.current.startY = e.clientY
      //   console.log(`起始X: ${coords.current.startX}`)
      //   console.log(`起始Y: ${coords.current.startY}`)
    }

    const onMouseUp = (e: MouseEvent) => {
      isClicked.current = false
      coords.current.lastX = button.offsetLeft
      coords.current.lastY = button.offsetTop
      check(coords.current.lastX, coords.current.lastY) // 當前版面最後 XY

        console.log(`結束X: ${coords.current.lastX}`)
        console.log(`結束Y: ${coords.current.lastY}`)
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isClicked.current) return

      // 修正 button 在畫面上的 XY 軸
      // 要扣掉原本 button 所在的 XY 值
      const nextX = e.clientX - coords.current.startX + coords.current.lastX
      const nextY = e.clientY - coords.current.startY + coords.current.lastY
      //   console.log(`移動時滑鼠X: ${e.clientX}`)
      //   console.log(`移動時滑鼠Y: ${e.clientY}`)
      //   console.log(`移動時初始X: ${coords.current.startX}`)
      //   console.log(`移動時初始Y: ${coords.current.startY}`)
      //   console.log(`移動時最後X: ${coords.current.lastX}`)
      //   console.log(`移動時最後Y: ${coords.current.lastY}`)

      //   console.log(nextX)
      //   console.log(nextY)
      button.style.top = `${nextY}px`
      button.style.left = `${nextX}px`
    }

    button.addEventListener('mousedown', onMouseDown)
    button.addEventListener('mouseup', onMouseUp)
    box.addEventListener('mousemove', onMouseMove)
    box.addEventListener('mouseleave', onMouseUp)

    const cleanup = () => {
      button.removeEventListener('mousedown', onMouseDown)
      button.removeEventListener('mouseup', onMouseUp)
      box.removeEventListener('mousemove', onMouseMove)
      box.removeEventListener('mouseleave', onMouseUp)
      //   console.log('button cleanup')
    }
    //  30, 140
    //  210, 170
    return cleanup
  }, [])

  return (
    <>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h5" sx={{ width: '100%' }}>
          請將按鈕拖曳至正確位置
        </Typography>
        <IconButton onClick={() => props.handleQuestionClose()}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box
        ref={boxRef}
        sx={{
          mt: 1.5,
          position: 'relative',
          border: 1.5,
          bordercolor: 'black',
          borderRadius: 1.5,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 1.5,
        }}
      >
        {/* 顯示圖片 */}
        <Box
          component="img"
          src="/images/question.svg" // 變數替換 是否有圖片有則是網址
          alt="Failt to load"
          sx={{
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            borderRadius: 2,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        ></Box>
        {/*  Draggable Icon */}
        <Box
          ref={buttonRef}
          sx={{
            bottom: '2.5%',
            right: '2.5%',
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 35,
            height: 35,
            borderRadius: '50%',
            bgcolor: isCorrect ? '#00A600 ' : '#EA7500',
          }}
        >
          <AddCircleOutlineIcon
            sx={{ color: 'white', width: 30, height: 30 }}
          ></AddCircleOutlineIcon>
        </Box>
      </Box>
    </>
  )
}
export default Drag
