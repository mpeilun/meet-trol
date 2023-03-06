import { Modal, Box, Card } from '@mui/material'
import RankQuestion from '../question/rank/rank'
import QuestionType from './questionType'
import Choice from '../question/choice/choice'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Widgets } from '@mui/icons-material'

import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { setQuestionLocate } from '../../store/course-data'

import { useWindowDimensions } from '../../hooks/common'

const PopupModal = (props: {
  setClose: () => void
  setOpen: Function
  open: boolean
  questionType: number
}) => {
  const questionRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [isRender, setIsRender] = useState(false)
  const viewPort = useWindowDimensions()

  //redux
  const look = useAppSelector((state) => state.course.lookingQuestion)
  // const questionLocate = useAppSelector((state) => state.course.questionLocate)
  // const eyeTracking = useAppSelector((state) => state.course.eyeTracking)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (questionRef.current) {
      const questionWidth = questionRef.current.clientWidth
      const questionHeight = questionRef.current.clientHeight
      const xEnd = viewPort.width - viewPort.width * 0.2
      const xStart = xEnd - questionWidth
      const yStart = viewPort.height * 0.2
      const yEnd = yStart + questionHeight
      dispatch(
        setQuestionLocate({
          w: questionWidth,
          h: questionHeight,
          xStart: xStart,
          xEnd: xEnd,
          yStart: yStart,
          yEnd: yEnd,
        })
      )

      setIsRender(true)
      console.log(questionWidth, questionHeight)
    }
  }, [questionRef.current?.clientHeight])

  return (
    <>
      {/* BUG: 全螢幕不會顯示、位置不會自適應 */}
      {/* For testing */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: props.open ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          visibility: 'visible',
          position: 'absolute',
          top:'-10%',
          left: '-5%',
          zIndex: 5,
          // top: '20%',
          // right: '20%',
          // left: 'auto',
          // bottom: 'auto',
        }}
      >
        {/* <Modal
        ref={modalRef}
        sx={{
          // width: '50%',
          // height: '50%',
          visibility: isRender ? 'visible' : 'hidden',
          position: 'absolute',
          top: '20%',
          right: '20%',
          left: 'auto',
          bottom: 'auto',
        }}
        open={props.open || !isRender}
        onClose={props.setClose}
        closeAfterTransition
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      > */}
        <Card
          ref={questionRef}
          sx={{
            display: 'inline-block',
            // minWidth: 600,
            maxWidth: 700,
            maxHeight: 500,
            border: look ? '0.3rem outset green' : '0.3rem outset red',
          }}
        >
          <Box
            sx={{
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 700,
              maxHeight: 450,
            }}
          >
            <QuestionType
              setClose={props.setClose}
              setOpen={props.setOpen}
              open={props.open}
              questionType={props.questionType}
            ></QuestionType>
          </Box>
        </Card>

        {/* </Modal> */}
      </Box>
    </>
  )
}

export default PopupModal
