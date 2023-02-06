import { Box, Divider, IconButton, Typography, Button } from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DragDrop from './dragDrop'

// 需引入變數 questions & answers
const FillIn = (props: { handleQuestionClose: () => void }) => {
  return (
    <Box>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h5" sx={{ width: '100%' }}>
          請填入正確的答案
        </Typography>
        <IconButton  onClick={() => props.handleQuestionClose()}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'hidden',
          overflowY: 'auto',
          pt: 2,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <DndProvider backend={HTML5Backend}>
          <DragDrop></DragDrop>
        </DndProvider>
      </Box>
      {/* <Button
          size="medium"
          variant="contained"
          color="secondary"
          fullWidth
          sx ={{mt: 2}}
          // onClick={checkAns}
          // disabled={items.length < 2 || items.length > 200}
        >
          送出
        </Button> */}
    </Box>
    //   </Card>
    // </Box>
  )
}

export default FillIn
