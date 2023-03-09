import React from 'react'
import { useDrag } from 'react-dnd'
import { Box, Typography, Grid } from '@mui/material'

function FillItem(props: { title: string; index: number; isReply: boolean }) {
  const emptyRef = React.useRef()
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'text',
    item: { ans: props.title },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <Box
      ref={props.isReply ? emptyRef : drag}
      // overflow="hidden"
      // textOverflow="ellipsis"
      // whiteSpace="normal"
      sx={{
        // my: 1,
        border:2,
        px: 3,
        borderRadius: 12,
        bgcolor: 'primary.light',
      }}
      style={{
        color: 'white',
        borderColor: isDragging ? 'red' : 'black',
      }}
    >
      <Typography
      // variant="body1"
      // style={{ whiteSpace: 'normal' }}
      >
        {props.title}
      </Typography>
    </Box>
  )
}

export default FillItem
