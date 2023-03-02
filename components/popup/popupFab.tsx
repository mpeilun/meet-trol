import * as React from 'react'
import Fab from '@mui/material/Fab'
import InfoIcon from '@mui/icons-material/Info'
import MenuIcon from '@mui/icons-material/Menu'
import CameraIcon from '@mui/icons-material/Camera'
import { Typography } from '@mui/material'
import PopupModal from './popupModel'
import { ChoiceData, RankData, FillData, DragData } from '../../types/chapter'
import { Info } from '@prisma/client'

const PopupFab = (props: {
  pause: () => void
  play: () => void
  data: Info | ChoiceData | RankData | FillData | DragData
}) => {
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

  const [openQuestion, setopenQuestion] = React.useState(false)
  const handleOpenQuestion = () => {
    setopenQuestion(true)
    props.pause()
  }
  const handleCloseQuestion = () => {
    setopenQuestion(false)
    props.play()
  }

  if (props.data.questionType == 0) {
    return (
      <>
        <Fab
          sx={{
            mb:1,
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
          <InfoIcon />
        </Fab>
        <PopupModal
          setClose={handleCloseQuestion}
          setOpen={handleOpenQuestion}
          open={openQuestion}
          questionType={props.data.questionType}
          // data={props.data}
        ></PopupModal>
      </>
    )
  } else if (0 < props.data.questionType && props.data.questionType < 4) {
    return (
      <>
        <Fab
          sx={{
            mb:1,
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
          <MenuIcon />
        </Fab>
        <PopupModal
          setClose={handleCloseQuestion}
          setOpen={handleOpenQuestion}
          open={openQuestion}
          questionType={props.data.questionType}
          // data={props.data}
        ></PopupModal>
      </>
    )
  } else if (props.data.questionType == 4) {
    return (
      <>
        <Fab
          sx={{
            mb:1,
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
          <CameraIcon />
        </Fab>
        <PopupModal
          setClose={handleCloseQuestion}
          setOpen={handleOpenQuestion}
          open={openQuestion}
          questionType={props.data.questionType}
          // data={props.data}
        ></PopupModal>
      </>
    )
  } else {
    return <Typography>題目顯示失敗</Typography>
  }
}

export default PopupFab
