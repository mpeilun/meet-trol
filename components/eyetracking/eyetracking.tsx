import Script from 'next/script'
import { Modal, Fab, Button, Box, Typography } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled/types/base'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { updateEyeTracking } from '../../store/course-data'
import { isLooking } from '../../store/course-data'
import { red } from '@mui/material/colors'
import { green } from '@mui/material/colors'
import WebGazer from '../../types/webgazer'
import { LoadingButton } from '@mui/lab'
import { InformedConsent } from '@prisma/client'
import { sendMessage } from '../../store/notification'
declare var webgazer: WebGazer

function EyesTracking() {
  const [gazer, setGazer] = useState(false)
  const [correction, setCorrection] = useState(false)
  const [webgazerScript, setWebgazerScript] = useState(false)
  const [consentLoadingButton, setConsentLoadingButton] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const handleModalOpen = () => {
    setModalOpen(true)
  }
  const handleModalClose = () => {
    setModalOpen(false)
    setCorrection(true)
  }

  const eyeTracking = useAppSelector((state) => state.course.eyeTracking)
  const eyeTrackingRef = useRef<{ x: number; y: number }>()
  const questionLocate = useAppSelector((state) => state.course.questionLocate)
  const questionLocateRef = useRef<{
    xStart: number
    xEnd: number
    yStart: number
    yEnd: number
  }>()
  const dispatch = useAppDispatch()

  // const [eyesTrackingRecord, setEyesTrackingRecord] = useState([{ x: 0, y: 0 }])

  useEffect(() => {
    if (webgazerScript) {
      const fetchData = async () => {
        const res = await fetch(`/api/consent`)
        if (res.status != 200) {
          handleModalOpen()
        } else {
          webgazer.begin()
        }
      }
      fetchData()
    }
  }, [webgazerScript])

  useEffect(() => {
    eyeTrackingRef.current = eyeTracking
  }, [eyeTracking])

  useEffect(() => {
    questionLocateRef.current = questionLocate
  }, [questionLocate])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        var prediction = await webgazer.getCurrentPrediction()
        //redux
        dispatch(updateEyeTracking({ x: prediction.x, y: prediction.y }))
        console.log(eyeTrackingRef.current)
        const questionLocateCurrent = questionLocateRef.current!

        // setEyesTrackingRecord((prev) => [
        //   ...prev,
        //   { x: prediction.x, y: prediction.y },
        // ])

        const range = 50

        if (
          prediction.x >= questionLocateCurrent.xStart - range &&
          prediction.x <= questionLocateCurrent.xEnd + range &&
          prediction.y >= questionLocateCurrent.yStart - range &&
          prediction.y <= questionLocateCurrent.yEnd + range
        ) {
          dispatch(isLooking(true))
        } else {
          dispatch(isLooking(false))
        }
      } catch {
        //webgazer is not ready yet
      }
    }, 200)
    return () => clearInterval(interval)
  }, [webgazerScript])

  return (
    <>
      <Script
        src="../external-script/webgazer.js"
        onLoad={() => {
          setWebgazerScript(true)
          webgazer.showVideo(false)
          // webgazer.showPredictionPoints(false)
          // webgazer.setGazeListener(function (data: { x: any; y: any } | null, elapsedTime: any) {
          //   if (data == null) {
          //     return
          //   }
          //   var xPrediction = data.x //these x coordinates are relative to the viewport
          //   var yPrediction = data.y //these y coordinates are relative to the viewport
          //   //redux
          //   dispatch(updateEyeTracking({ x: xPrediction, y: yPrediction }))
          //   console.log(eyeTrackingRef.current)
          //   if (xPrediction >= questionLocate.xStart && xPrediction <= questionLocate.xEnd && yPrediction >= questionLocate.yStart && yPrediction <= questionLocate.yEnd) {
          //     dispatch(isLooking(true))
          //   } else {
          //     dispatch(isLooking(false))
          //   }
          // })
        }}
      />
      {/* onClose={handleModalClose} */}
      <Modal open={modalOpen} disableAutoFocus>
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <LoadingButton
            loading={consentLoadingButton}
            variant="contained"
            onClick={async () => {
              setConsentLoadingButton(true)
              const consent = await fetch('/api/consent', {
                method: 'POST',
                body: JSON.stringify({ isAgree: true, isComplete: false }),
              })
              if (consent.status === 200) {
                webgazer.begin()
                handleModalClose()
              } else {
                dispatch(
                  sendMessage({
                    severity: 'error',
                    message: '發生異常',
                    duration: 'short',
                  })
                )
              }
              setConsentLoadingButton(false)
            }}
          >
            我同意，並開始校正
          </LoadingButton>
        </Box>
      </Modal>
      {/* <Button
        onClick={() => {
          webgazer.begin()
          // webgazer.showVideo(false)
        }}
      >
        START
      </Button>
      <Button
        onClick={() => {
          if (gazer) {
            webgazer.resume()
          } else {
            webgazer.pause()
          }
          setGazer(!gazer)
          console.log(gazer)
        }}
      >
        PAUSE/RESUME
      </Button>
      <Button
        onClick={() => {
          // 計算平均運動量
          let sumOfDeltas = 0
          let numberOfMeasurements = 0
          for (let i = 1; i < eyesTrackingRecord.length; i++) {
            const previousPosition = eyesTrackingRecord[i - 1]
            const currentPosition = eyesTrackingRecord[i]
            const deltaX = Math.abs(currentPosition.x - previousPosition.x)
            const deltaY = Math.abs(currentPosition.y - previousPosition.y)
            const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2)
            sumOfDeltas += delta
            numberOfMeasurements++
          }

          const averageMotion = sumOfDeltas / numberOfMeasurements
          console.log('averageMotion', averageMotion)
        }}
      >
        計算平均位移
      </Button>
      <Button
        onClick={() => {
          setEyesTrackingRecord([{ x: 0, y: 0 }])
        }}
      >
        清除
      </Button>
      <Button
        onClick={() => {
          setCorrection(!correction)
          console.log(correction)
        }}
      >
        校正
      </Button> */}
      {correction ? <Ball open={correction} setOpen={setCorrection} /> : null}
    </>
  )
}

export default EyesTracking

function Ball(props: { open: boolean; setOpen: Function }) {
  const COLORS = ['red', 'blue', 'green', 'orange', 'yellow', 'white', 'black']
  const [coords, setCoords] = useState({ x: 0, y: 0, color: 'red' })
  const [mousePos, setMousePos] = useState({})
  const [clickCount, setClickCount] = useState(0)
  const [count, setCount] = useState(9)

  const modalRef = useRef<HTMLDivElement>(null)

  const vw = modalRef.current?.clientWidth
  const vh = modalRef.current?.clientHeight

  useEffect(() => {
    const handleMouseMove = (event: { clientX: number; clientY: number }) => {
      setMousePos({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  return (
    <>
      <Modal ref={modalRef} open={props.open}>
        <Box>
          <Box
            height={'100px'}
            width={'200px'}
            position={'absolute'}
            sx={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
            }}
          >
            <Typography color={'red'}>
              校正中，請注視紅點，並不斷點擊它
            </Typography>
          </Box>
          <Fab
            id="ball"
            size="small"
            sx={{
              backgroundColor: 'red',
              position: 'absolute',
              left: coords.x,
              top: coords.y,
            }}
            onClick={() => {
              if (count == 0) {
                props.setOpen(false)
                return
              }
              if (clickCount == 3) {
                setCoords({
                  x: Math.floor(Math.random() * (vw! - 40)),
                  y: Math.floor(Math.random() * (vh! - 40)),
                  color: COLORS[Math.floor(Math.random() * COLORS.length)],
                })
                setClickCount(0)
                setCount((prev) => prev - 1)
              } else {
                setClickCount((prev) => prev + 1)
              }
              console.log('max width', vw)
              console.log(coords)
              console.log(mousePos)
            }}
          ></Fab>
        </Box>
      </Modal>
    </>
  )
}
