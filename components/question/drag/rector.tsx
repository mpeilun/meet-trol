/* eslint-disable @next/next/no-img-element */
import { Box } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

function Rector(props: {
  onSelected: (rect: {
    x: number
    y: number
    width: number
    height: number
  }) => void
  imgUrl: string
  lineWidth: number
  strokeStyle: string
}) {
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrag, setIsDrag] = useState(false)
  const [startX, setStartX] = useState(-1)
  const [startY, setStartY] = useState(-1)
  const [curX, setCurX] = useState(-1)
  const [curY, setCurY] = useState(-1)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  // useEffect(() => {
  //   const canvas = canvasRef.current
  //   const ctx = canvas.getContext('2d')
  //   ctx.strokeStyle = props.strokeStyle
  //   ctx.lineWidth = props.lineWidth
  // }, [])

  useEffect(() => {
    if (isDrag) {
      console.log('mousedown', isDrag)
      //   updateCanvas()
    } else {
      console.log('mouseup')
      const rect = {
        x: Math.round(startX * (600 / imageSize.width)),
        y: Math.round(startY * (600 / imageSize.width)),
        width: curX - startX,
        height: curY - startY,
      }
      props.onSelected(rect)
    }
  }, [isDrag])

  useEffect(() => {
    if (isDrag) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, imageSize.width, imageSize.height)
      const rect = {
        x: startX,
        y: startY,
        w: curX - startX,
        h: curY - startY,
      }
      console.log('stroke', startX, startY, curX, curY)
      ctx.strokeStyle = props.strokeStyle
      ctx.lineWidth = props.lineWidth
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
    }
  }, [curX, curY])

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setIsDrag(true)
    setStartX(e.nativeEvent.offsetX)
    setStartY(e.nativeEvent.offsetY)
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrag) return
    setCurX(e.nativeEvent.offsetX)
    setCurY(e.nativeEvent.offsetY)
  }

  function onMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    setIsDrag(false)
  }

  return (
    <>
      <img
        ref={imageRef}
        alt="請填入圖片網址"
        width={'100%'}
        style={{
          objectFit: 'fill',
          WebkitUserSelect: 'none',
          KhtmlUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        }}
        onLoad={(e) => {
          setImageSize({
            width: e.currentTarget.clientWidth,
            height: e.currentTarget.clientHeight,
          })
        }}
        src={props.imgUrl}
      />
      <Box width={imageSize.width} height={0}>
        <canvas
          style={{
            position: 'relative',
            zIndex: 10,
            top: -imageRef.current?.offsetHeight,
          }}
          onMouseUp={(e) => onMouseUp(e)}
          onMouseDown={(e) => onMouseDown(e)}
          onMouseMove={(e) => onMouseMove(e)}
          width={imageSize.width}
          height={imageSize.height}
          ref={canvasRef}
        ></canvas>
      </Box>
    </>
  )
}

export default Rector
