import { useState } from 'react'
import {
  Card,
  Box,
  Input,
  InputLabel,
  TextField,
  FormControl,
  Typography,
  Button,
  Checkbox,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Choice as ChoicePrisma } from '@prisma/client'

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

const CreateChoice = () => {
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

  const handleOptionChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuestion((prev) => {
        const prevOptions = prev.options
        prevOptions[index].option = event.target.value
        return { ...prev, options: prevOptions }
      })
      // if (question.options[index]) {
      //   setQuestion((prev) => {
      //     const prevOptions = prev.options
      //     prevOptions[index].option = event.target.value
      //     return { ...prev, options: prevOptions }
      //   })
      // } else {
      //   setQuestion((prev) => {
      //     const prevOptions = prev.options
      //     prevOptions.push({ option: event.target.value, isAnswer: false })
      //     return { ...prev, options: prevOptions }
      //   })
      // }
    }

  const handleCheckedChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuestion((prev) => {
        const prevOptions = prev.options
        prevOptions[index].isAnswer = event.target.checked
        return { ...prev, options: prevOptions }
      })
    }

  const Options = question.options.map((item, index) => {
    return (
      <Box sx={{ flexDirection: 'row' }} key={item.option}>
        <TextField
          sx={{ m: 1, width: '60%' }}
          variant="standard"
          label={`選項 ${index + 1}`}
          value={question.options[index].option}
          onChange={handleOptionChange(index)}
        />
        <Checkbox
          sx={{ mt: 2 }}
          checked={question.options[index].isAnswer}
          onChange={handleCheckedChange(index)}
        />
        <Button
          sx={{ width: '5%', mt: 2 }}
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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Card sx={{ width: 400, height: 'auto', p: 5, m: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography>題目</Typography>
          <TextField
            sx={{ m: 1 }}
            variant="standard"
            label="題目"
            value={question.title}
            onChange={handleTitleChange}
          />
          <Typography sx={{ mt: 2 }}>選項</Typography>
          {Options}
          <Button sx={{ m: 2 }} variant="outlined" onClick={addOption}>
            新增選項
          </Button>
          <Button
            sx={{ m: 2 }}
            variant="outlined"
            onClick={handleQuestionSubmit}
          >
            送出
          </Button>

          {/* <Typography sx={{ mt: 2, mb: 2 }}>正確答案</Typography>
                    <p>測試(題目)：{question.title}</p>
                    <p>測試(選項)：{JSON.stringify(question.options)}</p>
                    <p>測試(正確答案)：{JSON.stringify(question.checked)}</p> */}
          {/* <p>測試 {JSON.stringify(res)}</p> */}
        </Box>
      </Card>
      {/* <ChoiceStudent {...submitQuestion} /> */}
    </Box>
  )
}
export default CreateChoice
