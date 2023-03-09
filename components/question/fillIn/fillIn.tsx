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
const FillIn = (props: { handleQuestionClose: () => void; data: FillData }) => {
  const data = props.data

  return (
    <Box>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h5" sx={{ width: '100%' }}>
          {data.title}
        </Typography>
        <IconButton onClick={() => props.handleQuestionClose()}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Typography variant="body2" sx={{ pt: 1.5 }}>
        {data.content ?? ''}
      </Typography>
      <DragDrop data={data}></DragDrop>
    </Box>
    //   </Card>
    // </Box>
  )
}

export default FillIn
