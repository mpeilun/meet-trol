import { Box, Card, Divider, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SingleChoice from './singleChoice'
export default function Choice(props: { handleQuestionClose: () => void }) {
  return (
    // <Card
    //   sx={{
    //     width: '600px',
    //     height: '400px',
    //     position: 'absolute',
    //     display: props.displayQuestion ? 'block' : 'none',
    //     left: 0,
    //     right: 0,
    //     top: 0,
    //     bottom: 0,
    //     m: 'auto',
    //     boxShadow: 10,
    //   }}
    // >
    <Box>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h5" sx={{ width: '100%' }}>
          問題
        </Typography>
        <IconButton onClick={() => props.handleQuestionClose()}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <SingleChoice handleClose={props.handleQuestionClose} />
    </Box>
    // </Card>
  )
}
