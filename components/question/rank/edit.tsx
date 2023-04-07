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
  ButtonGroup,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import { Rank } from '@prisma/client'
import { Video } from '../../../types/video-edit'
import { SelectType } from '../../../pages/courses/edit/question/[id]'
import { sendMessage } from '../../../store/notification'
import { useAppDispatch } from '../../../hooks/redux'

const defaultQuestion: Rank = {
  id: null,
  questionType: 'rank',
  title: '排序題',
  question: '',
  note: '',
  isShowAnswer: false,
  options: [],
  start: 0,
  end: 0,
  videoId: null,
}

const EditRank = (props: {
  video: Video
  setVideo: Dispatch<SetStateAction<Video>>
  select: SelectType
  setSelect: Dispatch<SetStateAction<SelectType>>
  selectRange: number[]
}) => {
  const dispatch = useAppDispatch()

  const { video, setVideo, select, setSelect, selectRange } = props
  const [question, setQuestion] = useState<Rank>(
    (select.initQuestion as Rank) ?? { ...defaultQuestion, videoId: video.id }
  )
  const [isQuestionSubmit, setIsQuestionSubmit] = useState(false)
  const [isQuestionDelete, setIsQuestionDelete] = useState(false)

  useEffect(() => {
    if (select.value) {
      setQuestion(select.initQuestion as Rank)
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
        .then((data: Rank) => {
          console.log(data)
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
        .then((data: Rank) => {
          console.log(data)
          setVideo((prev) => {
            prev.question[select.value] = data
            return { ...prev }
          })
          setIsQuestionSubmit(false)
          dispatch(sendMessage({ severity: 'success', message: '更新成功' }))
        })
        .catch((err) => {
          dispatch(sendMessage({ severity: 'success', message: err }))
        })
    }
  }

  const addOption = () => {
    setQuestion((prev) => {
      const prevOptions = prev.options
      return { ...prev, options: [...prevOptions, '新的選項'] }
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
          prevOptions[index] = event.target.value
          return { ...prev, options: prevOptions }
        })
      }

    return (
      <Box sx={{ flexDirection: 'row' }} key={`option-${index}`}>
        <TextField
          sx={{ m: 1, width: '60%' }}
          variant="standard"
          label={`選項 ${index + 1}`}
          value={item}
          onChange={handleOptionChange(index)}
        />
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
        {/* <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <Typography sx={{ mt: 2 }}>顯示答案</Typography>
          <Checkbox
            sx={{ mt: 2 }}
            checked={question.isShowAnswer}
            onChange={handleIsShowAnswerChange}
          />
        </Box> */}
        <Typography sx={{ mt: 2 }}>選項</Typography>
        {Options}
        <Button
          sx={{ m: 1, width: '7rem', height: '3rem' }}
          variant="outlined"
          onClick={addOption}
        >
          新增選項
        </Button>
        <Box ml={'auto'}>
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
export default EditRank
