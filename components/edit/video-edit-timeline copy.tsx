import { height, width } from '@mui/system'
import React, { useRef, useEffect } from 'react'
import { Rnd } from 'react-rnd'

const Row = () => {
  const rootRef = useRef(null)
  const rndRef = useRef(null)
  const [width, setWidth] = React.useState(200)
  const [height, setHeight] = React.useState(50)
  const [x, setX] = React.useState(0)
  const [y, setY] = React.useState(0)

  useEffect(() => {
    if (rndRef?.current) {
      setY(rndRef?.current?.offsetTop)
      console.log(rndRef?.current?.offsetTop, y)
    }
  }, [rndRef?.current?.offsetTop])

  const handleResizeStop = (e, direction, ref, delta) => {
    if (direction === 'left') {
      setX(x - delta.width)
      // setY(y - delta.height)
    }
    setWidth(ref.style.width)
    setHeight(ref.style.height)
  }

  const handleDragStop = (e, d) => {
    setX(d.x)
    setY(d.y)
  }

  const style = {
    display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    border: 'solid 1px #000',
    background: '#f0f0f0',
  }

  return (
    <div
      ref={rootRef}
      style={{ width: `100%`, height: `50px`, overflow: 'hidden' }}
    >
      <Rnd
        ref={rndRef}
        style={style}
        size={{ width: width, height: height }}
        position={{ x: x, y: y }}
        minWidth={100}
        maxWidth={rootRef?.current?.clientWidth}
        bounds={rootRef?.current}
        onResizeStop={handleResizeStop}
        onDragStop={handleDragStop}
        dragAxis="x"
        enableResizing={{
          left: true,
          right: true,
          top: false,
          bottom: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <div>Row item</div>
      </Rnd>
    </div>
  )
}

export default Row
