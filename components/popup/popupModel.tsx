import { Modal, Box, Card } from '@mui/material'
import RankQuestion from '../question/rank/rank'
import QuestionType from './questionType'
import Choice from '../question/choice/choice'

const PopupModal = (props: {
  setClose: () => void
  setOpen: Function
  open: boolean
  questionType: number
}) => {
  return (
    <>
      {/* BUG: 全螢幕不會顯示、位置不會自適應 */}
      <Modal
        sx={{
          // width: '50%',
          // height: '50%',
          position: 'absolute',
          top: '25%',
          left: '15%',
          right: 'auto',
          bottom: 'auto',
        }}
        open={props.open}
        onClose={props.setClose}
        closeAfterTransition
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <Card
            sx={{
              display: 'inline-block',
            }}
          >
            <Box
              sx={{
                overflow: 'hidden',
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
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
        </Box>
      </Modal>
    </>
  )
}

export default PopupModal
