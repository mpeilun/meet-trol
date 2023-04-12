import * as React from 'react'
import Fab from '@mui/material/Fab'
import InfoIcon from '@mui/icons-material/Info'
import MenuIcon from '@mui/icons-material/Menu'
import CameraIcon from '@mui/icons-material/Camera'
import { Typography } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import PopupModal from './popupModel'
import { ChoiceData, RankData, FillData, DragData } from '../../types/chapter'
import { Info, InteractionLog } from '@prisma/client'
import { useTransition, animated } from '@react-spring/web'

export function questionStyle(questionType: string) {
  switch (questionType) {
    case 'info':
      return {
        icon: <InfoIcon />,
        displayName: '資訊',
      }
    case 'drag':
      return {
        icon: <CameraIcon />,
        displayName: '圖選',
      }
    case 'choice':
      return {
        icon: <CameraIcon />,
        displayName: '選擇',
      }
    case 'rank':
      return {
        icon: <CameraIcon />,
        displayName: '排序',
      }
    case 'fill':
      return {
        icon: <CameraIcon />,
        displayName: '填充',
      }
    default: //'choice' | 'rank' | 'fill'
      return {
        icon: <MenuIcon />,
        displayName: '題目',
      }
  }
}

const PopupFab = (props: {
  interactionLog: React.MutableRefObject<InteractionLog[]>
  pause: () => void
  play: () => void
  data: Info | ChoiceData | RankData | FillData | DragData
  isFullScreen: boolean
}) => {
  // console.log('pop render')
  const playedSecond = useAppSelector((state) => state.course.playedSecond)

  // const QuestionType = (questionType: number) => {
  //   if (props.data.questionType== 0) {
  //     return <InfoIcon />
  //   } else if (questionType == 1 || questionType == 2 || questionType == 3) {
  //     return <MenuIcon />
  //   } else if (questionType == 4) {
  //     return <CameraIcon />
  //   } else {
  //     return <Typography>題目顯示失敗</Typography>
  //   }
  // }

  const [openQuestion, setOpenQuestion] = React.useState(true)
  const handleOpenQuestion = React.useCallback(() => {
    setOpenQuestion(true)
    props.pause()
    // console.log('pause')
  }, [playedSecond])
  const handleCloseQuestion = React.useCallback(() => {
    setOpenQuestion(false)
    props.play()
    // console.log('play')
  }, [playedSecond])

  // console.log(props.data)

  if (playedSecond > props.data.start && playedSecond < props.data.end) {
    if (openQuestion) {
      props.pause()
    }

    if (props.data.questionType == 'info') {
      return (
        <>
          <Fab
            sx={{
              mb: 1,
              // width: '50%',
              // height: '50%',z
              // position: 'absolute',
              // top: '20%',
              // left: '10%',
              // right: 'auto',
              // bottom: 'auto',
              zIndex: 1,
              visibility: openQuestion ? 'hidden' : 'visible',
              // display: props.open ? 'none' : 'flex',
            }}
            color="warning"
            aria-label="info"
            onClick={() => {
              handleOpenQuestion()
            }}
          >
            {questionStyle('info').icon}
          </Fab>
          <PopupModal
            interactionLog={props.interactionLog}
            setClose={handleCloseQuestion}
            open={openQuestion}
            data={props.data}
            isFullScreen={props.isFullScreen}
          ></PopupModal>
        </>
      )
    } else if (
      props.data.questionType == 'choice' ||
      props.data.questionType == 'rank' ||
      props.data.questionType == 'fill'
    ) {
      return (
        <>
          <Fab
            sx={{
              mb: 1,
              // width: '50%',
              // height: '50%',
              // position: 'absolute',
              // top: '20%',
              // left: '10%',
              // right: 'auto',
              // bottom: 'auto',
              zIndex: 1,
              visibility: openQuestion ? 'hidden' : 'visible',
              // display: props.open ? 'none' : 'flex',
            }}
            color="primary"
            aria-label="choice"
            onClick={() => {
              handleOpenQuestion()
            }}
          >
            {questionStyle('choice || rank || fill').icon}
          </Fab>
          <PopupModal
            interactionLog={props.interactionLog}
            setClose={handleCloseQuestion}
            open={openQuestion}
            data={props.data}
            isFullScreen={props.isFullScreen}
          ></PopupModal>
        </>
      )
    } else if (props.data.questionType == 'drag') {
      return (
        <>
          <Fab
            sx={{
              mb: 1,
              // width: '50%',
              // height: '50%',
              // position: 'absolute',
              // top: '20%',
              // left: '10%',
              // right: 'auto',
              // bottom: 'auto',
              zIndex: 1,
              visibility: openQuestion ? 'hidden' : 'visible',
              // display: props.open ? 'none' : 'flex',
            }}
            color="secondary"
            aria-label="drag"
            onClick={() => {
              handleOpenQuestion()
            }}
          >
            {questionStyle('drag').icon}
          </Fab>
          <PopupModal
            interactionLog={props.interactionLog}
            setClose={handleCloseQuestion}
            open={openQuestion}
            data={props.data}
            isFullScreen={props.isFullScreen}
          ></PopupModal>
        </>
      )
    } else {
      return <Typography>題目顯示失敗</Typography>
    }
  } else {
    if (openQuestion) {
      // handleCloseQuestion()
    }
    return <></>
  }
}

export default React.memo(PopupFab)
