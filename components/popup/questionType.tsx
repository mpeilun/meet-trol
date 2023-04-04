import { Modal, Box, Card, Typography } from '@mui/material'
import Choice from '../question/choice/choice'
import RankQuestion from '../question/rank/rank'
import Info from '../question/info/info'
import FillIn from '../question/fillIn/fillIn'
import Drag from '../question/drag/drag'
import { ChoiceData, RankData, FillData, DragData } from '../../types/chapter'
import { Info as InfoData } from '@prisma/client'

const QuestionType = (props: {
  setClose: () => void
  data: InfoData | ChoiceData | RankData | FillData | DragData
  isLog?: boolean
  feedbackIndex?: number
}) => {
  // console.log(props.questionType)
  switch (props.data.questionType) {
    // info
    case 'info':
      return (
        <Info
          handleQuestionClose={props.setClose}
          data={props.data as InfoData}
        ></Info>
      )

    // choice
    case 'choice':
      return (
        <Choice
          handleQuestionClose={props.setClose}
          data={props.data as ChoiceData}
          isLog={props.isLog ?? false}
          feedbackIndex={props.feedbackIndex ?? 0}
        ></Choice>
      )

    // FillIn
    case 'fill':
      return (
        <FillIn
          handleQuestionClose={props.setClose}
          data={props.data as FillData}
          isLog={props.isLog ?? false}
          feedbackIndex={props.feedbackIndex ?? 0}
        ></FillIn>
      )

    // rank
    case 'rank':
      return (
        <RankQuestion
          handleQuestionClose={props.setClose}
          data={props.data as RankData}
          isLog={props.isLog ?? false}
          feedbackIndex={props.feedbackIndex ?? 0}
        ></RankQuestion>
      )

    // drag
    case 'drag':
      return (
        <Drag
          handleQuestionClose={props.setClose}
          data={props.data as DragData}
          isLog={props.isLog ?? false}
          feedbackIndex={props.feedbackIndex ?? 0}
        ></Drag>
      )

    default:
      return <Typography>題目顯示失敗</Typography>
  }
}

export default QuestionType
