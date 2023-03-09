import * as React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import {
  Button,
  Box,
  AlertColor,
  Collapse,
  Alert,
  FormGroup,
  Checkbox,
} from '@mui/material'
import { ChoiceData } from '../../../types/chapter'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

interface alert {
  isShow: boolean
  text: string
  severity: AlertColor
}

export default function MultipleChoice(props: { data: ChoiceData }) {
  const data = props.data

  const [checked, setChecked] = React.useState(
    new Array(data.options.length).fill(false)
  )
  const [isReply, setIsReply] = React.useState(false)

  const [isAnsError, setIsAnsError] = React.useState<alert>({
    isShow: false,
    text: '',
    severity: 'error',
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const answers = data.options.map(({ isAnswer }) => isAnswer)
    // console.log(answers)
    // console.log(checked)
    if (!checked.includes(true)) {
      setIsAnsError({
        isShow: true,
        text: '請選擇答案',
        severity: 'warning',
      })
    } else if (!data.isShowAnswer) {
      setIsReply(true)
      setIsAnsError({
        isShow: true,
        text: '請繼續作答',
        severity: 'info',
      })
    } else if (answers.every((value, index) => value === checked[index])) {
      setIsReply(true)
      setIsAnsError({
        isShow: data.isShowAnswer,
        text: '正確',
        severity: 'success',
      })
      // new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve(true)
      //   }, 750)
      // }).then(() => {
      //   // props.handleQuestionClose()
      // })
    } else {
      setIsReply(true)
      setIsAnsError({
        isShow: data.isShowAnswer,
        text: '錯誤',
        severity: 'error',
      })
    }
  }

  const handleChange = (event, index) => {
    const newChecked = [...checked]
    newChecked[index] = event.target.checked
    setChecked(newChecked)
    setIsAnsError({
      isShow: false,
      text: '',
      severity: 'info',
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ pt: 1, width: '100%' }} variant="standard">
        <FormLabel id="demo-error-radios">{data.content ?? ''}</FormLabel>
        <Box sx={{ height: 0 }}></Box>
        <FormGroup>
          {data.options.map((option, index) => {
            return (
              <FormControlLabel
                disabled={isReply}
                key={`${index}- ${option.option} option`}
                value={index}
                control={
                  <Checkbox
                    checked={checked[index]}
                    onChange={(event) => handleChange(event, index)}
                    name={`${option.option}`}
                  />
                }
                label={option.option}
              ></FormControlLabel>
            )
          })}
        </FormGroup>
        <Collapse in={isAnsError.isShow}>
          <Alert severity={isAnsError.severity} sx={{ mb: 1.5 }}>
            {isAnsError.text}
          </Alert>
        </Collapse>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {isReply && data.note && (
            <Button
              disableElevation
              type="button"
              variant="contained"
              onClick={() => {
                setIsAnsError({
                  isShow: true,
                  text: data.note ?? '',
                  severity: isAnsError.severity,
                })
              }}
              sx={{ width: 125, fontWeight: 'bold', borderRadius: 16 }}
            >
              詳解
            </Button>
          )}
          <Box></Box>
          <Button
            disableElevation
            type="submit"
            variant="contained"
            disabled={isReply}
            startIcon={<CheckCircleOutlineIcon />}
            sx={{
              bgcolor: '#82CD00',
              '&:hover': {
                backgroundColor: '#54B435',
                color: 'white',
              },
              width: 125,
              fontWeight: 'bold',
              borderRadius: 16,
            }}
          >
            送出
          </Button>
        </Box>
      </FormControl>
    </form>
  )
}
