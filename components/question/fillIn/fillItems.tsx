import React from 'react'
import { useDrag } from 'react-dnd'
import { Box, Typography, Grid } from '@mui/material'


function FillItem(props: {  title: string; index: number}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'text',
    item: {ans: props.title} ,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  return (
    <>
      <Box
        // overflow="hidden"
        // textOverflow="ellipsis"
        // whiteSpace="normal"
        ref={drag}
        sx={{
          border: 3,
          // my: 1,
          px: 1,
          borderRadius: 2,
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
    </>
  )
}

export default FillItem
