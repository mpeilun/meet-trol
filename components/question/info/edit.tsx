import { useState, useRef, SetStateAction, Dispatch, useEffect } from 'react'
import {
  Box,
  TextField,
  Typography,
  Button,
  Checkbox,
  Tooltip,
  SxProps,
  Theme,
  ButtonGroup,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import DeleteIcon from '@mui/icons-material/Delete'
import { Info } from '@prisma/client'
import { PlayerProgress } from '../../../types/react-player'
import { Video } from '../../../types/video-edit'
import { SelectType } from '../../../pages/courses/edit/[id]'
import Notification from '../../notification/notification'
import { useAppDispatch } from '../../../hooks/redux'
import { sendMessage } from '../../../store/notification'

const defaultQuestion: Info = {
  id: null,
  questionType: 'info',
  title: '資訊卡',
  content: '',
  url: '',
  start: 0,
  end: 0,
  videoId: null,
}

const EditInfo = (props: {
  video: Video
  setVideo: Dispatch<SetStateAction<Video>>
  select: SelectType
  setSelect: Dispatch<SetStateAction<SelectType>>
  selectRange: number[]
}) => {
  const dispatch = useAppDispatch()

  const { video, setVideo, select, setSelect, selectRange } = props
  const [question, setQuestion] = useState<Info>(
    (select.initQuestion as Info) ?? { ...defaultQuestion, videoId: video.id }
  )

  const [isQuestionSubmit, setIsQuestionSubmit] = useState(false)
  const [isQuestionDelete, setIsQuestionDelete] = useState(false)

  useEffect(() => {
    if (select.value != null) {
      setQuestion(select.initQuestion as Info)
    }
  }, [select])

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((prev) => ({ ...prev, title: event.target.value }))
  }

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((prev) => ({ ...prev, content: event.target.value }))
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((prev) => ({ ...prev, url: event.target.value }))
  }

  const handleQuestionDelete = () => {
    setIsQuestionDelete(true)
    fetch(`/api/question`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: question }),
    })
      .then((response) => response.json())
      .then((data) => {
        setVideo((prev) => ({
          ...prev,
          question: prev.question.filter((q) => q.id !== question.id),
        }))
        setIsQuestionDelete(false)
        setSelect({ value: null, initQuestion: null })
        dispatch(sendMessage({ severity: 'success', message: '刪除成功' }))
      })
      .catch((err) => {
        dispatch(sendMessage({ severity: 'error', message: err }))
      })
  }
  const handleQuestionSubmit = () => {
    //TODO 可能需要提取成一個function
    //TODO Choice 也需要通知
    setIsQuestionSubmit(true)
    if (select.value == null) {
      const { id, ...addData } = question
      fetch('/api/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: {
            ...addData,
            start: selectRange[0],
            end: selectRange[1],
          },
        }),
      })
        .then((response) => response.json())
        .then((data: Info) => {
          setVideo((prev) => ({ ...prev, question: [data, ...prev.question] }))
          setIsQuestionSubmit(false)
          setSelect({ value: 0, initQuestion: data })
          dispatch(sendMessage({ severity: 'success', message: '新增成功' }))
        })
        .catch((err) => {
          dispatch(sendMessage({ severity: 'error', message: err }))
        })
    } else {
      const updateData = question
      fetch('/api/question', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: {
            ...updateData,
            start: selectRange[0],
            end: selectRange[1],
          },
        }),
      })
        .then((response) => response.json())
        .then((data: Info) => {
          setVideo((prev) => {
            prev.question[select.value] = data
            return { ...prev }
          })
          setIsQuestionSubmit(false)
          dispatch(sendMessage({ severity: 'success', message: '更新成功' }))
        })
        .catch((err) => {
          dispatch(sendMessage({ severity: 'error', message: err }))
        })
    }
  }
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          sx={{ m: 1 }}
          variant="standard"
          label="標題"
          value={question.title}
          onChange={handleTitleChange}
        />
        <TextField
          multiline
          sx={{ m: 1 }}
          variant="standard"
          label="內容"
          value={question.content}
          onChange={handleContentChange}
        />
        <TextField
          sx={{ m: 1 }}
          variant="standard"
          label="附加圖片"
          value={question.url}
          onChange={handleUrlChange}
        />
        <img src={question.url} />

        <Box m={'16px auto 0 auto'}>
          <ButtonGroup>
            {select.value != null ? (
              <LoadingButton
                loading={isQuestionDelete}
                sx={{ width: '7rem', height: '3rem' }}
                variant="outlined"
                onClick={handleQuestionDelete}
              >
                {'刪除'}
              </LoadingButton>
            ) : null}
            <LoadingButton
              loading={isQuestionSubmit}
              sx={{ width: '7rem', height: '3rem' }}
              variant="outlined"
              onClick={handleQuestionSubmit}
            >
              {select.value != null ? '更新' : '新增'}
            </LoadingButton>
          </ButtonGroup>
        </Box>
      </Box>
    </>
  )
}
export default EditInfo
