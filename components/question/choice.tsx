import { Box, Card, Divider, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import SingleChoice from './singleChoice';
export default function Choice(props: { displayQuestion: boolean, handleQuestionClose: Function}) {
  return (
    <Card sx={{
      width: '600px',
      height: '400px',
      position: 'absolute',
      display: props.displayQuestion ? 'block' : 'none',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      m: 'auto',
      boxShadow:10
    }}>
      <Box minHeight={50} display='flex' alignItems='center'>
        <Typography variant='h5' sx={{mt:2, ml:3, width: '100%'}}>問題</Typography>
        <IconButton sx={{mr:2}} onClick={()=>props.handleQuestionClose()}>
          <CloseIcon/>
        </IconButton>
      </Box>
      <Divider variant='middle' />
      <SingleChoice handleClose={props.handleQuestionClose}/>
    </Card>
  )
}