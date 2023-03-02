import React from 'react'
import { Rnd } from 'react-rnd'

const RowItem = () => {
  const [width, setWidth] = React.useState(200)
  const [x, setX] = React.useState(0)
  const [y, setY] = React.useState(0)

  const handleResizeStop = (e, direction, ref) => {
    setWidth(ref.style.width)
  }

  const handleDragStop = (e, d) => {
    setX(d.x)
    setY(d.y)
  }

  return (
    <Rnd
      default={{
        width: 200,
        height: 50,
        x: 0,
        y: 500,
      }}
      minWidth={200}
      maxWidth={400}
      bounds=".parent-range"
      onResizeStop={handleResizeStop}
      onDragStop={handleDragStop}
      dragAxis="x"
      resizeHandleClasses={{
        bottomRight: 'bottom-right-handle',
      }}
    >
      <div className="row-item" style={{ backgroundColor: '#000' }}>
        This is a row item
      </div>
    </Rnd>
  )
}

const Row = () => {
  return (
    <div className="parent-range" style={{ width: '100%', height: '500px' }}>
      <RowItem />
    </div>
  )
}

export default Row
