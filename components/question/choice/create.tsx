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
import { TimeField } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import { PlayerProgress } from '../../../pages/courses/edit/question'

interface Choice extends ChoicePrisma {
  id: string | null
  videoId: string | null
}

const initQuestion: Choice = {
  id: null,
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
        <Typography>Test {props.playerProgress.playedSeconds}</Typography>
        <Typography>時間</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" sx={{ m: 1 }}>
            <VideoTimePicker label="開始" sx={{ mr: 5 }} />
            <VideoTimePicker label="結束" />
          </Box>
        </LocalizationProvider>
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

function VideoTimePicker(props: { label?: string; sx?: SxProps<Theme> }) {
  const timeFieldRef = useRef<HTMLInputElement>(null)
  const [timePicker, setTimePicker] = useState<Dayjs | null>(
    dayjs().startOf('date')
  )

  const timerButtonSx: SxProps<Theme> = {
    height: '50%',
    p: 0,
    borderRadius: 0.5,
    maxWidth: '20px',
    minWidth: '20px',
    maxHeight: '20px',
    minHeight: '20px',
  }

  return (
    <>
      <Box display="flex" flexDirection="row" sx={props.sx}>
        <TimeField
          variant="standard"
          ref={timeFieldRef}
          label={props.label}
          value={timePicker}
          onChange={(newValue: Dayjs) => setTimePicker(newValue)}
          format="HH:mm:ss"
          sx={{ maxWidth: '120px', minWidth: '120px', display: 'flex' }}
        />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent={'space-evenly'}
          ml={0.5}
        >
          <Button
            variant="contained"
            sx={{ ...timerButtonSx, mb: 0.25 }}
            onClick={() => {
              setTimePicker((prev) => prev?.add(1, 'minute'))
            }}
          >
            <ArrowDropUpOutlinedIcon />
          </Button>
          <Button
            variant="contained"
            sx={{ ...timerButtonSx, mt: 0.25 }}
            onClick={() => {
              setTimePicker((prev) => prev?.subtract(1, 'minute'))
            }}
          >
            <ArrowDropDownOutlinedIcon />
          </Button>
        </Box>
      </Box>
    </>
  )
}
