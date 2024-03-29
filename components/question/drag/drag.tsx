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

interface props {
  close: () => void
  handleQuestionClose: () => void
  isLog: boolean
  data: DragData
  feedbackIndex: number
}

const Drag = ({
  close,
  handleQuestionClose,
  isLog,
  data,
  feedbackIndex,
}: props) => {
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

  const [correctColor, setCorrectColor] = useState('#EA7540')
  const [isReply, setIsReply] = React.useState(false)
  const [isAnsError, setIsAnsError] = useState<alert>({
    isShow: false,
    text: '',
    severity: 'error',
  })

  useEffect(() => {
    if (!isReply && !isLog) {
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
      }

      const onMouseUp = (e: MouseEvent) => {
        isClicked.current = false
        coords.current.lastX = button.offsetLeft
        coords.current.lastY = button.offsetTop
      }

      const onMouseMove = (e: MouseEvent) => {
        if (!isClicked.current) return

        // 修正 button 在畫面上的 XY 軸
        // 要扣掉原本 button 所在的 XY 值
        const nextX = e.clientX - coords.current.startX + coords.current.lastX
        const nextY = e.clientY - coords.current.startY + coords.current.lastY

        //TODO DEBUG
        console.log('nextX Y', nextX, nextY)

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
      }
      //  30, 140
      //  210, 170
      return cleanup
    }
  }, [isReply])

  const isCorrect = (): boolean => {
    const isCorrect: boolean[] = data.options.map(({ x, y, width, height }) => {
      const X = coords.current.lastX
      const Y = coords.current.lastY
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
    fetch('/api/interactiveData/drag/pushAns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: { x: coords.current.lastX, y: coords.current.lastY },
        dragId: data.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error))
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

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  return (
    <>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 'bold', width: '100%' }}>
          {data.title ?? '圖選題'}
        </Typography>
        <IconButton
          onClick={async () => {
            close()
            // await delay(200)
            handleQuestionClose()
          }}
        >
          <CloseIcon sx={{ fontSize: 40, color: 'black' }} />
        </IconButton>
      </Box>
      <Divider />
      {data.question && (
        <Typography sx={{ pt: 1.5, fontSize: 24, letterSpacing: 1 }}>
          {data.question ?? ''}
        </Typography>
      )}
      <Box>
        <Box
          ref={isReply ? emptyRef : boxRef}
          sx={{
            width: 600,
            height: '100%',
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
            {!isLog && (
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
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}
export default Drag
