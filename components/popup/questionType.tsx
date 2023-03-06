import { Modal, Box, Card, Typography } from '@mui/material'
import Choice from '../question/choice/choice'
import RankQuestion from '../question/rank/rank'
import Info from '../question/info/info'
import FillIn from '../question/fillIn/fillIn'
import Drag from '../question/drag/drag'

const QuestionType = (props: {
  setClose: () => void
  setOpen: Function
  open: boolean
  questionType: string
}) => {
  // console.log(props.questionType)
  switch (props.questionType) {
    // info
    case 'info':
      return (
        <>
          <Info handleQuestionClose={props.setClose}></Info>
        </>
      )

    // choice
    case 'choice':
      return <Choice handleQuestionClose={props.setClose}></Choice>

    // FillIn
    case 'fill':
      return (
        <>
          <FillIn handleQuestionClose={props.setClose}></FillIn>
        </>
      )

    // rank
    case 'rank':
      return <RankQuestion handleQuestionClose={props.setClose}></RankQuestion>

    // drag
    case 'drag':
      return <Drag handleQuestionClose={props.setClose}></Drag>

    default:
      return <Typography>題目顯示失敗</Typography>
  }
}

export default QuestionType
