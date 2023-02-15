import Script from 'next/script'
declare var webgazer: any
import { Modal, Fab, Button, Box } from '@mui/material'
import { useState, useEffect } from 'react'
import styled from '@emotion/styled/types/base'

function EyesTracking() {
  const [gazer, setGazer] = useState(false)
  const [correction, setCorrection] = useState(false)

  return (
    <>
      <Script
        src="../external-lib/webgazer.js"
        onLoad={() => {
          webgazer.setGazeListener(function (data: { x: any; y: any } | null, elapsedTime: any) {
            if (data == null) {
              return
            }
            var xPrediction = data.x //these x coordinates are relative to the viewport
            var yPrediction = data.y //these y coordinates are relative to the viewport
            console.log(xPrediction, yPrediction, elapsedTime) //elapsed time is based on time since begin was called
          })
        }}
      />
      <Button
        onClick={() => {
          webgazer.begin()
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
      {correction ? <Ball /> : null}
    </>
  )
}

export default EyesTracking

function Ball() {
  const COLORS = ['red', 'blue', 'green', 'orange', 'yellow', 'white', 'black']
  const [coords, setCoords] = useState({ x: 0, y: 0, color: 'red' })
  const [mousePos, setMousePos] = useState({})
  const [clickCount, setClickCount] = useState(0)
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
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
      <Modal open={true}>
        <Box>
          <Fab
            id="ball"
            size="small"
            sx={{
              backgroundColor: 'red',
              position: 'absolute',
              zIndex: 2 ^ 53,
              left: coords.x,
              top: coords.y,
            }}
            onClick={() => {
              if (clickCount == 3) {
                setCoords({
                  x: Math.floor(Math.random() * (vw - 40)),
                  y: Math.floor(Math.random() * (vh - 40)),
                  color: COLORS[Math.floor(Math.random() * COLORS.length)],
                })
                setClickCount(0)
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
