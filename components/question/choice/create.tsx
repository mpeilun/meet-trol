import { useState } from 'react'
import { Box, TextField, Typography, Button, Checkbox } from '@mui/material'
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
          label={`選項 ${index + 1} key=${index}`}
          value={item.option}
          onChange={handleOptionChange(index)}
        />
        <Checkbox
          sx={{ mt: 2 }}
          checked={item.isAnswer}
          onChange={handleCheckedChange(index)}
          inputProps={{
            'aria-label': '是否為答案',
          }}
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
  //
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>題目</Typography>
        <TextField
          sx={{ m: 1 }}
          variant="standard"
          label="輸入題目"
          value={question.title}
          onChange={handleTitleChange}
        />
        <Typography sx={{ mt: 2 }}>選項</Typography>
        {Options}
        {/* TODO 處利x軸滾動問題 */}
        <Box>
          <Button
            sx={{ m: 1, width: '7rem' }}
            variant="outlined"
            onClick={addOption}
          >
            新增選項
          </Button>
          <Button
            sx={{ m: 1, width: '7rem' }}
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
