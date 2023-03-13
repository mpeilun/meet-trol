import { useState, useRef } from 'react'
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
import { Info as InfoPrisma } from '@prisma/client'
import { PlayerProgress } from '../../../types/react-player'

interface Info extends InfoPrisma {
  id: string | null
  videoId: string | null
}

const defaultInfo: Info = {
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
  initInfo?: Info
  playerProgress: PlayerProgress
  setPlayerProgress: Function
}) => {
  const { initInfo, playerProgress, setPlayerProgress } = props
  const [question, setQuestion] = useState<Info>(initInfo ?? defaultInfo)

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
      </Box>
    </>
  )
}
export default EditInfo
