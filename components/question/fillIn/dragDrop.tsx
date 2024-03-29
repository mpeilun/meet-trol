import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Button,
  Collapse,
  Alert,
  AlertColor,
} from '@mui/material'
import { DndProvider, useDrag } from 'react-dnd'
import FillItem from './fillItems'
import AnsItem from './ansItems'
import { FillData } from '../../../types/chapter'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

interface alert {
  isShow: boolean
  text: string
  severity: AlertColor
}

const DragDrop = (props: {
  data: FillData
  isLog: boolean
  feedbackIndex: number
}) => {
  const data = props.data
  const question = data.question
  const regex = /(?<=\().+?(?=\))/g // 正則表達式 匹配所有括號內的文字
  const answers: string[] = question.match(regex)
  const options = data.options
  const questionElement = []
  const optionElement = []
  const [myAnswer, setMyAnswer] = React.useState<string[]>([])

  const [isAnsError, setIsAnsError] = React.useState<alert>({
    isShow: false,
    text: '',
    severity: 'error',
  })
  const [isReply, setIsReply] = React.useState<boolean>(false)

  const isCorrect = (answers: string[], myAnswer: string[]): boolean => {
    if (answers.length !== myAnswer.length) {
      return false
    }
    const isIdentical = answers.every((element, index) => {
      return element === myAnswer[index]
    })
    return isIdentical
  }

  const checkAns = () => {
    fetch('/api/interactiveData/fill/pushAns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: myAnswer, fillId: data.id }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error))
    if (!data.isShowAnswer) {
      setIsReply(true)
      setIsAnsError({
        isShow: true,
        text: '請繼續作答',
        severity: 'info',
      })
    } else if (isCorrect(answers, myAnswer)) {
      setIsReply(true)
      setIsAnsError({
        isShow: data.isShowAnswer,
        text: '正確',
        severity: 'success',
      })
    } else {
      setIsReply(true)
      setIsAnsError({
        isShow: data.isShowAnswer,
        text: '錯誤',
        severity: 'error',
      })
    }
  }

  const questionComponent = () => {
    let isInsideBracket = false
    let answerIndex = 0
    for (let i = 0; i < question.length; i++) {
      const char = question[i]
      if (char === '(') {
        isInsideBracket = true
      } else if (isInsideBracket) {
        if (char === ')') {
          questionElement.push(
            <AnsItem
              key={`${i}ans`}
              index={answerIndex}
              ans={answers[answerIndex]}
              isReply={isReply}
              isShowAnswer={data.isShowAnswer}
              setMyAnswer={setMyAnswer}
              myAnswer={myAnswer}
            ></AnsItem>
          )
          isInsideBracket = false
          answerIndex++
        }
      } else {
        questionElement.push(
          <span style={{ fontSize: 24 }} key={`${i}text`}>
            {question[i]}
          </span>
        )
      }
    }
  }
  questionComponent()

  const optionComponent = () => {
    const element = options.map((title, index) => {
      return (
        <FillItem
          key={`dragdrop-ans-${index}`}
          title={title}
          index={index}
          isReply={isReply}
        ></FillItem>
      )
    })
    optionElement.push(element)
  }

  optionComponent()
  // TO-DO 改成 beautiful-dnd
  return (
    <Box>
      <Box
        sx={{
          overflow: 'hidden',
          overflowY: 'auto',
          pt: 1.5,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <DndProvider backend={HTML5Backend}>
          {/* questions */}
          <Box
            sx={{
              border: 2,
              p: 2,
              mr: 2,
              borderRadius: 2,
              lineHeight: 2,
              // display: 'flex',
              // flexDirection: 'row',
              // justifyContent: 'space-around',
              minWidth: 350,
              minHeight: 250,
            }}
          >
            {questionElement}
          </Box>
          {/* answer items */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              height: '100%',
              border: 2,
              px: 1,
              borderRadius: 2,
              minWidth: 200,
              minHeight: 250,
            }}
          >
            {optionElement}
          </Box>
        </DndProvider>
      </Box>
      {/* remark */}
      <Collapse in={isAnsError.isShow}>
        <Alert severity={isAnsError.severity} sx={{ mt: 1.5 }}>
          {isAnsError.text}
        </Alert>
      </Collapse>

      {/* submit */}
      <Box
        sx={{
          pt: 1.5,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {isReply && data.note && (
          <Button
            disableElevation
            type="button"
            variant="contained"
            onClick={() => {
              setIsAnsError({
                isShow: true,
                text: data.note ?? '',
                severity: 'info',
              })
            }}
            sx={{ width: 125, fontWeight: 'bold', borderRadius: 16 }}
          >
            詳解
          </Button>
        )}
        <Box></Box>
        {!props.isLog && (
          <Button
            disableElevation
            type="submit"
            variant="contained"
            disabled={isReply}
            startIcon={<CheckCircleOutlineIcon />}
            sx={{
              bgcolor: '#82CD00',
              '&:hover': {
                backgroundColor: '#54B435',
                color: 'white',
              },
              width: 125,
              fontWeight: 'bold',
              borderRadius: 16,
            }}
            onClick={checkAns}
          >
            送出
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default DragDrop
