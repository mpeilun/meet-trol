import { useState, useRef, Dispatch, SetStateAction, useEffect } from 'react'
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
import { Choice } from '@prisma/client'
import { Video } from '../../../types/video-edit'
import { SelectType } from '../../../pages/courses/edit/[id]'

const defaultQuestion: Choice = {
  id: null,
  questionType: 'choice',
  title: '選擇題',
  question: '',
  note: '',
  isShowAnswer: false,
  options: [{ option: '', isAnswer: false }],
  start: 0,
  end: 0,
  videoId: null,
}

const EditChoice = (props: {
  video: Video
  setVideo: Dispatch<SetStateAction<Video>>
  select: SelectType
  setSelect: Dispatch<SetStateAction<SelectType>>
  selectRange: number[]
}) => {
  const { video, setVideo, select, setSelect, selectRange } = props
  const [question, setQuestion] = useState<Choice>(
    (select.initQuestion as Choice) ?? { ...defaultQuestion, videoId: video.id }
  )

  useEffect(() => {
    if (select.value) {
      setQuestion(select.initQuestion as Choice)
    }
  }, [select])

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((prev) => ({ ...prev, title: event.target.value }))
  }

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((prev) => ({ ...prev, question: event.target.value }))
  }

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion((prev) => {
      prev.note = event.target.value
      return { ...prev }
    })
  }

  const handleQuestionSubmit = () => {
    //TODO 可能需要提取成一個function
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
        .then((data: Choice) => {
          console.log(data)
          setVideo((prev) => ({ ...prev, question: [data, ...prev.question] }))
          setSelect({ value: 0, initQuestion: data })
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
        .then((data: Choice) => {
          console.log(data)
          setVideo((prev) => {
            prev.question[select.value] = data
            return { ...prev }
          })
        })
    }
  }

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

  const handleIsShowAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuestion((prev) => {
      prev.isShowAnswer = event.target.checked
      return { ...prev }
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

    const handleIsAnswerChange =
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
            onChange={handleIsAnswerChange(index)}
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
          label="問題"
          value={question.question}
          onChange={handleQuestionChange}
        />
        <TextField
          sx={{ m: 1 }}
          variant="standard"
          label="提示"
          value={question.note}
          onChange={handleNoteChange}
        />
        <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <Typography sx={{ mt: 2 }}>顯示答案</Typography>
          <Checkbox
            sx={{ mt: 2 }}
            checked={question.isShowAnswer}
            onChange={handleIsShowAnswerChange}
          />
        </Box>
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
            sx={{ m: 1, width: '7rem', height: '3rem' }}
            variant="outlined"
            onClick={handleQuestionSubmit}
          >
            {select.value != null ? '更新' : '新增'}
          </Button>
        </Box>
      </Box>
    </>
  )
}
export default EditChoice
