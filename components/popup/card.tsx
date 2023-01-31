import { Box, Card, Divider, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Component } from 'react'
import { ChildProps } from '../type'



export default function PopCard(props: {
  displayQuestion: boolean
  handleQuestionClose: Function
  component: React.ComponentType<ChildProps>
}) {
  return (
    <Card
      sx={{
        width: '600px',
        height: '400px',
        position: 'absolute',
        display: props.displayQuestion ? 'block' : 'none',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        m: 'auto',
        boxShadow: 10,
      }}
    >
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h5" sx={{ mt: 3, ml: 3, width: '100%' }}>
          問題
        </Typography>
        <IconButton sx={{ mr: 2 }} onClick={() => props.handleQuestionClose()}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider variant="middle" />
      <Component></Component>
    </Card>
  )
}
