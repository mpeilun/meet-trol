import {
  Box,
  Divider,
  IconButton,
  Typography,
  Button,
  AlertColor,
  Collapse,
  Alert,
} from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DragDrop from './dragDrop'
import { FillData } from '../../../types/chapter'

// 需引入變數 questions & answers
const FillIn = (props: {
  close: () => void
  handleQuestionClose: () => void
  data: FillData
  isLog: boolean
  feedbackIndex: number
}) => {
  const data = props.data
  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  return (
    <Box>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 'bold', width: '100%' }}>
          {data.title ?? '填充題'}
        </Typography>
        <IconButton
          onClick={async () => {
            props.close()
            // await delay(200)
            props.handleQuestionClose()
          }}
        >
          <CloseIcon sx={{fontSize:40, color: 'black'}}/>
        </IconButton>
      </Box>
      <Divider />
      <DragDrop
        data={data}
        isLog={props.isLog}
        feedbackIndex={props.feedbackIndex}
      ></DragDrop>
    </Box>
    //   </Card>
    // </Box>
  )
}

export default FillIn
