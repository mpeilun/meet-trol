import { Modal, Box, Card, Typography } from '@mui/material'
import Choice from '../question/choice/choice'
import RankQuestion from '../question/rank/rank'

const QuestionType = (props: {
  setClose: () => void
  setOpen: Function
  open: boolean
  questionType: number
}) => {
  console.log(props.questionType)
  switch (props.questionType) {
    // info
    case 0:
      return <></>

    // choice
    case 1:
      return (
        <Choice
          handleQuestionClose={props.setClose}
        ></Choice>
      )

    // input
    case 2:
      return <></>

    // rank
    case 3:
      return (
        <RankQuestion
          handleQuestionClose={props.setClose}
        ></RankQuestion>
      )

    // drag
    case 4:
      return <></>

    default:
      return <Typography>題目顯示失敗</Typography>
  }
}

export default QuestionType
