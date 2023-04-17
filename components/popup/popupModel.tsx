import { Modal, Box, Card, Button } from '@mui/material'
import RankQuestion from '../question/rank/rank'
import QuestionType from './questionType'
import Choice from '../question/choice/choice'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Widgets } from '@mui/icons-material'
import styles from './pop.module.css'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { setQuestionLocate } from '../../store/course-data'

import { useWindowDimensions } from '../../hooks/useWindowDimensions'
import { ChoiceData, RankData, FillData, DragData } from '../../types/chapter'
import { Info, InteractionLog } from '@prisma/client'
import React from 'react'
import {
  useTransition,
  animated,
  useSpringRef,
  config,
  useChain,
  useSpring,
} from '@react-spring/web'
const PopupModal = (props: {
  interactionLog: React.MutableRefObject<InteractionLog[]>
  setClose: () => void
  open: boolean
  data: Info | ChoiceData | RankData | FillData | DragData
  isFullScreen: boolean
}) => {
  const questionRef = useRef<HTMLDivElement>(null)
  const questionBoxRef = useRef<HTMLVideoElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [isRender, setIsRender] = useState(false)
  const viewPort = useWindowDimensions()

  // console.log('modal render')
  //redux
  const look = useAppSelector((state) => state.course.lookingQuestion)
  // const questionLocate = useAppSelector((state) => state.course.questionLocate)
  // const eyeTracking = useAppSelector((state) => state.course.eyeTracking)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // console.log(document.getElementById('course-material-div').scrollTop)
  }, [document.getElementById('course-material-div').scrollTop])

  useEffect(() => {
    if (questionRef.current) {
      const questionWidth = questionRef.current.clientWidth
      const questionHeight = questionRef.current.clientHeight
      // const xStart =
      //   viewPort.width * 0.166 +
      //   (viewPort.width - viewPort.width * 0.166) / 2 -
      //   questionWidth / 2
      const xStart = props.isFullScreen
        ? questionRef.current.offsetLeft + 4
        : document.getElementById('chapter-list').clientWidth +
          questionRef.current.offsetLeft +
          4
      const xEnd = xStart + questionWidth
      const yStart = props.isFullScreen
        ? questionRef.current.offsetTop + 4
        : document.getElementById('main-navigation').clientHeight +
          questionRef.current.offsetTop +
          4 -
          document.getElementById('course-material-div').scrollTop
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

      // console.log('question width height', questionWidth, questionHeight)
      // console.log('question locate', xStart, xEnd, yStart, yEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    document.getElementById('course-material-div').scrollTop,
    questionRef.current?.offsetLeft,
    questionRef.current?.offsetTop,
    viewPort,
  ])

  const secondsRef = useRef<number>(0)
  // console.log(secondsRef.current)

  useEffect(() => {
    let intervalId
    if (look) {
      intervalId = setInterval(() => {
        secondsRef.current += 1
      }, 1000)
    }

    return () => clearInterval(intervalId)
  }, [look])

  const [opens, setOpens] = React.useState(false)

  const close = React.useCallback(() => {
    props.interactionLog.current.push({
      questionId: props.data.id,
      openTime: timeOpen.current,
      closeTime: new Date(),
      focusTime: secondsRef.current,
    })
    secondsRef.current = 0
    setOpens(false)
  }, [])

  const animation = useSpring({
    opacity: opens ? 1 : 0,
    scale: opens ? 1 : 0,
  })

  const timeOpen = React.useRef<Date>(new Date())
  useEffect(() => {
    timeOpen.current = new Date()
    setOpens(props.open)
  }, [props.open])

  if (questionRef.current) {
    // console.log(questionRef.current.getBoundingClientRect().width)
    // console.log(questionRef.current.getBoundingClientRect().height)
  }
  return (
    <>
      {/* For testing */}
      <Box
        ref={questionBoxRef}
        sx={{
          width: '100%',
          height: '100%',
          display: props.open ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          visibility: 'visible',
          position: 'absolute',
          top: '-10%',
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
        <animated.div>
          <Card
            ref={questionRef}
            sx={{
              boxSizing: 'border-box',
              borderRadius: 6,
              display: 'inline-block',
              // minWidth: 600,
              maxWidth: 700,
              maxHeight: 500,

              border: look ? '0.3rem outset green' : '0.3rem outset red',
            }}
          >
            <Box
              sx={{
                overFlowX: 'hidden',
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 700,
                maxHeight: 450,
                minWidth: 600,
              }}
            >
              <QuestionType
                close={close}
                setClose={props.setClose}
                data={props.data}
              ></QuestionType>
            </Box>
          </Card>
        </animated.div>
        {/* </Modal> */}
      </Box>
    </>
  )
}

export default React.memo(PopupModal)
