import Script from 'next/script'
declare var webgazer: any
import { Modal, Fab, Button, Box } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled/types/base'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { updateEyeTracking } from '../../store/course-data'
import { isLooking } from '../../store/course-data'

function EyesTracking() {
  const [gazer, setGazer] = useState(false)
  const [correction, setCorrection] = useState(false)
  const [webgazerScript, setWebgazerScript] = useState(false)

  const eyeTracking = useAppSelector((state) => state.course.eyeTracking)
  const eyeTrackingRef = useRef<{ x: number; y: number }>()
  const questionLocate = useAppSelector((state) => state.course.questionLocate)
  const questionLocateRef = useRef<{ xStart: number; xEnd: number; yStart: number; yEnd: number }>()
  const dispatch = useAppDispatch()

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
        if (prediction.x >= questionLocateCurrent.xStart && prediction.x <= questionLocateCurrent.xEnd && prediction.y >= questionLocateCurrent.yStart && prediction.y <= questionLocateCurrent.yEnd) {
          dispatch(isLooking(true))
        } else {
          dispatch(isLooking(false))
        }
      } catch {
        //webgazer is not ready yet
      }
    }, 100)
    return () => clearInterval(interval)
  }, [webgazerScript])

  return (
    <>
      <Script
        src="../external-lib/webgazer.js"
        onLoad={() => {
          setWebgazerScript(true)
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
      <Button
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
          setCorrection(!correction)
          console.log(correction)
        }}
      >
        校正
      </Button>
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
  const eyeTracking = useAppSelector((state) => state.course.eyeTracking)

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
