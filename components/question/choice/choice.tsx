import { Box, Card, Divider, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SingleChoice from './singleChoice'
import { ChoiceData } from '../../../types/chapter'
import MultipleChoice from './multipleChoice'
export default function Choice(props: {
  close: () => void
  handleQuestionClose: () => void
  data: ChoiceData
  isLog: boolean
  feedbackIndex: number
}) {
  const data = props.data
  const count = data.options.reduce((acc, curr) => {
    if (curr.isAnswer === true) {
      return acc + 1
    }
    return acc
  }, 0)
  const isSingleChoice = count == 1
  // console.log(isSingleChoice)
  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  return (
    <Box sx={{ height: '100%' }}>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 'bold', width: '100%' }}>
          {data.title ?? '選擇題'}
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

      {isSingleChoice ? (
        <Box sx={{ minWidth: 400, height: '100%' }}>
          <SingleChoice
            data={data}
            isLog={props.isLog}
            feedbackIndex={props.feedbackIndex}
          />
        </Box>
      ) : (
        <Box sx={{ minWidth: 400 }}>
          <MultipleChoice
            data={data}
            isLog={props.isLog}
            feedbackIndex={props.feedbackIndex}
          ></MultipleChoice>{' '}
        </Box>
      )}
    </Box>
    // </Card>
  )
}
