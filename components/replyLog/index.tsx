import { Info } from '@prisma/client'
import { ChoiceData, RankData, FillData, DragData } from '../../types/chapter'
import QuestionType from '../popup/questionType'
import { CSSTransition } from 'react-transition-group'
import { useRef, useState } from 'react'
import Button from '@mui/material/Button'
import { Box, FormControl, InputLabel, MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import styles from './card.module.css'
import { Feedback } from '@mui/icons-material'
import { style } from '@mui/system'

const ReplyLog = (props: {
  questions: (Info | ChoiceData | RankData | FillData | DragData)[]
}) => {
  const [currentData, setCurrentData] = useState<number>(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const [answerIndex, setAnswerIndex] = useState<number>(0)

  const handleChange = (event: SelectChangeEvent) => {
    setAnswerIndex(parseInt(event.target.value))
  }

  const questions = props.questions.filter((question) =>
    question.hasOwnProperty('feedback')
  ) as unknown as (ChoiceData | RankData | FillData | DragData)[]
  const feedback = questions.map((question) => question.feedback)
  // debugger
  // console.log(feedback)

  return (
    <div style={{ height: '600px' }}>
      {questions.map((question, index) => {
        if (question.feedback.length === 0) {
          question.feedback.push(null)
        }
        return (
          <Box key={`${index}Box`}>
            <CSSTransition
              in={currentData === index}
              timeout={150}
              classNames={{
                enterActive:
                  direction === 'right'
                    ? styles.CardEnterActiveLeft
                    : styles.CardEnterActiveRight,
                enterDone:
                  direction === 'right'
                    ? styles.CardEnterDoneLeft
                    : styles.CardEnterDoneRight,
                exit:
                  direction === 'right'
                    ? styles.CardExitLeft
                    : styles.CardExitRight,
                exitActive:
                  direction === 'right'
                    ? styles.CardExitActiveLeft
                    : styles.CardExitActiveRight,
              }}
              unmountOnExit
            >
              <div>
                <FormControl
                  key={`${index}DropDownMenu`}
                  sx={{ minWidth: 120 }}
                  size="small"
                >
                  <InputLabel id="demo-select-small">Answer</InputLabel>
                  <Select
                    sx={{ fontWeigh: 'bold' }}
                    labelId="Answer"
                    id="Answer"
                    value={`${answerIndex}`}
                    label="Reply"
                    onChange={handleChange}
                  >
                    {question.feedback[0] === null ? (
                      <MenuItem value={0}>{`No answers`}</MenuItem>
                    ) : (
                      question.feedback.map((feedback, index) => {
                        return (
                          <MenuItem key={`menu${index}`} value={index}>
                            {`Answer ${index + 1}`}
                          </MenuItem>
                        )
                      })
                    )}
                  </Select>
                </FormControl>
                {question.feedback.map((feedback, index) => {
                  // debugger
                  return (
                    <Box key={`${index}BoxFeedback`}>
                      <CSSTransition
                        in={answerIndex === index}
                        timeout={300}
                        classNames={{
                          enterActive: styles.FeedbackEnterActive,
                          enterDone: styles.FeedbackEnterDone,
                          exit: styles.FeedbackExit,
                          exitActive: styles.FeedbackExitActive,
                        }}
                        unmountOnExit
                      >
                        {/* <QuestionType
                          key={`${index} question`}
                          setClose={() => {}}
                          data={question}
                          isLog={true}
                          feedbackIndex={answerIndex}
                        ></QuestionType> */}
                      </CSSTransition>
                    </Box>
                  )
                })}
              </div>
            </CSSTransition>
          </Box>
        )
      })}
      <Box
        sx={{
          pt: 1.5,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Button
          disableElevation
          variant="contained"
          onClick={() => {
            setCurrentData(
              currentData - 1 < 0 ? questions.length - 1 : currentData - 1
            )
            setDirection('left')
            setAnswerIndex(0)
          }}
          sx={{
            width: 125,
            fontWeight: 'bold',
            borderRadius: 16,
          }}
        >
          上一題
        </Button>
        <Box></Box>

        <Button
          disableElevation
          variant="contained"
          onClick={() => {
            setCurrentData(
              currentData + 1 > questions.length - 1 ? 0 : currentData + 1
            )
            setDirection('right')
            setAnswerIndex(0)
          }}
          sx={{
            width: 125,
            fontWeight: 'bold',
            borderRadius: 16,
          }}
        >
          下一題
        </Button>
      </Box>
    </div>
  )
}

export default ReplyLog
// const DataSwitcher: React.FC = () => {
//   const [currentData, setCurrentData] = useState<'data1' | 'data2'>('data1')

//   const handleDataChange = () => {
//     setCurrentData(currentData === 'data1' ? 'data2' : 'data1')
//   }

//   const renderData = () => {
//     switch (currentData) {
//       case 'data1':
//         return <Data1 name="John" />
//       case 'data2':
//         return <Data2 name="Jane" />
//       default:
//         return null
//     }
//   }

//   return (
//     <div>
//       <CSSTransition
//         in={currentData === 'data1'}
//         timeout={300}
//         classNames="fade"
//         unmountOnExit
//       >
//         <Data1 name="John" />
//       </CSSTransition>
//       <CSSTransition
//         in={currentData === 'data2'}
//         timeout={300}
//         classNames="fade"
//         unmountOnExit
//       >
//         <Data2 name="Jane" />
//       </CSSTransition>
//       <button onClick={handleDataChange}>Switch Data</button>
//     </div>
//   )
// }
