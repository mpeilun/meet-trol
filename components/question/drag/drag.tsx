import {
  Box,
  Typography,
  IconButton,
  Divider,
  Alert,
  Collapse,
  AlertColor,
  Button,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CloseIcon from '@mui/icons-material/Close'

import React, { useEffect, useRef, useState } from 'react'
import { height } from '@mui/system'
import { DragData } from '../../../types/chapter'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

interface alert {
  isShow: boolean
  text: string
  severity: AlertColor
}

const Drag = (props: { handleQuestionClose: () => void; data: DragData }) => {
  const boxRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
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

  const data = props.data
  const [correctColor, setCorrectColor] = useState('#EA7540')
  const [isReply, setIsReply] = React.useState(false)
  const [isAnsError, setIsAnsError] = useState<alert>({
    isShow: false,
    text: '',
    severity: 'error',
  })

  useEffect(() => {
    if (!isReply) {
      if (!boxRef.current || !buttonRef.current) return
      if (isReply) return
      const box = boxRef.current
      const button = buttonRef.current

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
        // console.log(`移動時最後X: ${coords.current.lastX}`)
        // console.log(`移動時最後Y: ${coords.current.lastY}`)

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
    }
  }, [isReply])

  const isCorrect = (): boolean => {
    console.log('checkAns')
    const isCorrect: boolean[] = data.options.map(({ x, y, width, height }) => {
      const X = coords.current.lastX
      const Y = coords.current.lastY
      console.log(X)
      console.log(Y)
      console.log(x)
      console.log(y)
      if (X > x && X < x + width && Y > y && Y < y + height) {
        return true
      } else {
        return false
      }
    })
    if (isCorrect.includes(true)) {
      return true
    } else return false
  }

  const checkAns = () => {
    const check = isCorrect()
    if (!data.isShowAnswer) {
      setIsReply(true)
      setIsAnsError({
        isShow: true,
        text: '請繼續作答',
        severity: 'info',
      })
    } else if (check) {
      setIsReply(true)
      setCorrectColor('#00A600')
      setIsAnsError({
        isShow: data.isShowAnswer,
        text: '正確',
        severity: 'success',
      })
    } else {
      setIsReply(true)
      setCorrectColor('#DF2E00')
      setIsAnsError({
        isShow: data.isShowAnswer,
        text: '錯誤',
        severity: 'error',
      })
    }
  }

  return (
    <>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h5" sx={{ width: '100%' }}>
          {data.title??'圖選題'}
        </Typography>
        <IconButton onClick={() => props.handleQuestionClose()}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Typography variant="body2" sx={{ pt: 1.5 }}>
        {data.content ?? ''}
      </Typography>
      <Box >
        <Box
          ref={isReply ? emptyRef : boxRef}
          sx={{
            width: 600,
            mt: 1.5,
            position: 'relative',
            border: 1.5,
            borderColor: 'black',
            borderRadius: 1.5,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* 顯示圖片 */}
          <Box
            component="img"
            src={data.url} // 變數替換 是否有圖片有則是網址
            alt="Fail to load"
            sx={{
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              objectFit: 'contain',
              borderRadius: 1.5,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          ></Box>
          {/*  Draggable Icon */}
          <Box
            ref={isReply ? emptyRef : buttonRef}
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
              bgcolor: correctColor,
            }}
          >
            <AddCircleOutlineIcon
              sx={{ color: 'white', width: 30, height: 30 }}
            ></AddCircleOutlineIcon>
          </Box>
        </Box>
        <Box>
          {/* remark */}
          <Collapse in={isAnsError.isShow}>
            <Alert severity={isAnsError.severity} sx={{ mt: 1.5 }}>
              {isAnsError.text}
            </Alert>
          </Collapse>
          {/* submit button */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {isReply && data.note && (
              <Button
                disableElevation
                type="button"
                variant="contained"
                onClick={() => {
                  setIsAnsError({
                    isShow: true,
                    text: data.note ?? '',
                    severity: 'info',
                  })
                }}
                sx={{
                  mt: 1.5,
                  width: 125,
                  fontWeight: 'bold',
                  borderRadius: 16,
                }}
              >
                詳解
              </Button>
            )}
            <Box></Box>
            <Button
              disableElevation
              type="submit"
              variant="contained"
              disabled={isReply}
              startIcon={<CheckCircleOutlineIcon />}
              sx={{
                mt: 1.5,
                bgcolor: '#82CD00',
                '&:hover': {
                  backgroundColor: '#54B435',
                  color: 'white',
                },
                width: 125,
                fontWeight: 'bold',
                borderRadius: 16,
              }}
              onClick={checkAns}
            >
              送出
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}
export default Drag
