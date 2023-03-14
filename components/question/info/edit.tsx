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

const defaultQuestion: Info = {
  id: null,
  questionType: 'info',
  title: '',
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
}) => {
  const { video, setVideo, select, setSelect } = props
  const [question, setQuestion] = useState<Info>(
    (select.initQuestion as Info) ?? defaultQuestion
  )

  useEffect(() => {
    if (select.value != null) {
      setQuestion(select.initQuestion as Info)
    }
  }, [select])

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((prev) => ({ ...prev, title: event.target.value }))
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((prev) => ({ ...prev, url: event.target.value }))
  }
  const handleInfoSubmit = () => {}

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ mt: 2 }}>資訊卡</Typography>
        <TextField
          sx={{ m: 1 }}
          variant="standard"
          label="內容"
          value={question.title}
          onChange={handleTitleChange}
        />
        <Typography sx={{ mt: 2 }}>新增圖片</Typography>
        <TextField
          sx={{ m: 1 }}
          variant="standard"
          label="圖片網址"
          value={question.url}
          onChange={handleUrlChange}
        />
        <img src={question.url} />
        <Button
          sx={{ m: '16px auto 0 auto', width: '7rem', height: '3rem' }}
          variant="outlined"
          onClick={handleInfoSubmit}
        >
          送出
        </Button>
      </Box>
    </>
  )
}
export default EditInfo
