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
import { Choice as ChoicePrisma } from '@prisma/client'
import { PlayerProgress } from '../../../pages/courses/edit/[id]'

interface Choice extends ChoicePrisma {
  id: string | null
  videoId: string | null
}

const initQuestion: Choice = {
  id: null,
  questionType: 0,
  title: '',
  options: [{ option: '', isAnswer: false }],
  start: 0,
  end: 0,
  videoId: null,
}

const CreateChoice = (props: {
  playerProgress: PlayerProgress
  setPlayerProgress: Function
}) => {
  const [question, setQuestion] = useState<Choice>(initQuestion)

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((prev) => ({ ...prev, title: event.target.value }))
  }
  const handleQuestionSubmit = () => {}

  const addOption = () => {
    setQuestion((prev) => {
      const prevOptions = prev.options
      prevOptions.push({ option: '', isAnswer: false })
      return { ...prev, options: prevOptions }
    })
  }

  const removeOption = (index: number) => {
    setQuestion((prev) => {
      const prevOptions = prev.options
      prevOptions.splice(index, 1)
      return { ...prev, options: prevOptions }
    })
  }

  //選項 Component
  const Options = question.options.map((item, index) => {
    const handleOptionChange =
      (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion((prev) => {
          const prevOptions = prev.options
          prevOptions[index].option = event.target.value
          return { ...prev, options: prevOptions }
        })
      }

    const handleCheckedChange =
      (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion((prev) => {
          const prevOptions = prev.options
          prevOptions[index].isAnswer = event.target.checked
          return { ...prev, options: prevOptions }
        })
      }
    return (
      <Box sx={{ flexDirection: 'row' }} key={`option-${index}`}>
        <TextField
          sx={{ m: 1, width: '60%' }}
          variant="standard"
          label={`選項 ${index + 1}`}
          value={item.option}
          onChange={handleOptionChange(index)}
        />
        <Tooltip title="設為答案">
          <Checkbox
            sx={{ mt: 2 }}
            checked={item.isAnswer}
            onChange={handleCheckedChange(index)}
          />
        </Tooltip>
        <Button
          sx={{ width: '5%', mt: 2, ml: 0.5 }}
          key={index}
          variant="outlined"
          onClick={() => {
            removeOption(index)
          }}
        >
          <DeleteIcon />
        </Button>
      </Box>
    )
  })
  //
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ mt: 2 }}>題目</Typography>
        <TextField
          sx={{ m: 1 }}
          variant="standard"
          label="輸入題目"
          value={question.title}
          onChange={handleTitleChange}
        />
        <Typography sx={{ mt: 2 }}>選項</Typography>
        {Options}
        <Box display="flex" justifyContent="space-between">
          <Button
            sx={{ m: 1, width: '7rem', height: '3rem' }}
            variant="outlined"
            onClick={addOption}
          >
            新增選項
          </Button>
          <Button
            sx={{ m: '1', width: '7rem', height: '3rem' }}
            variant="outlined"
            onClick={handleQuestionSubmit}
          >
            送出
          </Button>
        </Box>
      </Box>
    </>
  )
}
export default CreateChoice
