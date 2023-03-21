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
} from '@mui/material'
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

  const handleInfoSubmit = () => {
    //TODO 可能需要提取成一個function
    //TODO Choice 也需要通知
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
        <Button
          sx={{ m: '16px auto 0 auto', width: '7rem', height: '3rem' }}
          variant="outlined"
          onClick={handleInfoSubmit}
        >
          {select.value != null ? '更新' : '新增'}
        </Button>
      </Box>
    </>
  )
}
export default EditInfo
