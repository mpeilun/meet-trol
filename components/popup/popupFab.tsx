import Fab from '@mui/material/Fab'
import InfoIcon from '@mui/icons-material/Info'
import MenuIcon from '@mui/icons-material/Menu'
import CameraIcon from '@mui/icons-material/Camera'
import { Typography } from '@mui/material'
import PopupModal from './popupModel'

const PopupFab = (props: {
  setClose: () => void
  setOpen: Function
  open: boolean
  questionType: number
}) => {
  const QuestionType = (questionType: number) => {
    if (questionType == 0) {
      return <InfoIcon />
    } else if (questionType == 1 || questionType == 2 || questionType == 3) {
      return <MenuIcon />
    } else if (questionType == 4) {
      return <CameraIcon />
    } else {
      return <Typography>題目顯示失敗</Typography>
    }
  }

  if (props.questionType == 0) {
    return (
      <>
        <Fab
          sx={{
            // width: '50%',
            // height: '50%',z
            position: 'absolute',
            top: '20%',
            left: '10%',
            right: 'auto',
            bottom: 'auto',
            visibility: props.open ? 'hidden' : 'visible',
            // display: props.open ? 'none' : 'flex',
          }}
          color="warning"
          aria-label="info"
          onClick={() => {
            props.setOpen()
          }}
        >
          <InfoIcon />
        </Fab>
        <PopupModal
          setClose={props.setClose}
          setOpen={props.setOpen}
          open={props.open}
          questionType={props.questionType}
        ></PopupModal>
      </>
    )
  } else if (0 < props.questionType && props.questionType < 4) {
    return (
      <>
        <Fab
          sx={{
            // width: '50%',
            // height: '50%',
            position: 'absolute',
            top: '20%',
            left: '10%',
            right: 'auto',
            bottom: 'auto',
            visibility: props.open ? 'hidden' : 'visible',

            // display: props.open ? 'none' : 'flex',
          }}
          color="primary"
          aria-label="choice"
          onClick={() => {
            props.setOpen()
          }}
        >
          <MenuIcon />
        </Fab>
        <PopupModal
          setClose={props.setClose}
          setOpen={props.setOpen}
          open={props.open}
          questionType={props.questionType}
        ></PopupModal>
      </>
    )
  } else if (props.questionType == 4) {
    return (
      <>
        <Fab
          sx={{
            // width: '50%',
            // height: '50%',
            position: 'absolute',
            top: '20%',
            left: '10%',
            right: 'auto',
            bottom: 'auto',
            visibility: props.open ? 'hidden' : 'visible',
            // display: props.open ? 'none' : 'flex',
          }}
          color="secondary"
          aria-label="drag"
          onClick={() => {
            props.setOpen()
          }}
        >
          <CameraIcon />
        </Fab>
        <PopupModal
          setClose={props.setClose}
          setOpen={props.setOpen}
          open={props.open}
          questionType={props.questionType}
        ></PopupModal>
      </>
    )
  } else {
    return <Typography>題目顯示失敗</Typography>
  }
}

export default PopupFab
