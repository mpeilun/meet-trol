import * as React from 'react'
import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Button, Box, Card, TextField, Typography, Paper } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { sendMessage } from '../../../store/notification'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'

export default function Home() {
  const { data: session } = useSession()

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs())
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs())
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [titleError, setTitleError] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()

  const handelSubmit = async () => {
    if (title.length > 0) {
      setSubmitLoading(true)
      const submit = await fetch('/api/course', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          description: description,
          start: startDate,
          end: endDate,
        }),
      })
      if (submit.status === 201) {
        dispatch(
          sendMessage({
            severity: 'success',
            message: '新增成功',
            duration: 'short',
          })
        )
        router.push('/courses/manage')
      } else {
        dispatch(
          sendMessage({
            severity: 'error',
            message: '新增失敗',
            duration: 'short',
          })
        )
      }
      setSubmitLoading(false)
    } else {
      setTitleError(true)
    }
  }

  const handleChangeTitle = (event) => {
    setTitle(event.target.value)
  }
  const handleChangeDescription = (event) => {
    setDescription(event.target.value)
    if (event.target.value.length > 0) {
      setTitleError(false)
    } else {
      setTitleError(true)
    }
  }

  const newStart = () => setStartDate(newStart)
  const newEnd = () => setEndDate(newEnd)

  if (!session)
    return (
      <Box>
        <Typography variant="h2" sx={{ mt: '20%' }} fontWeight="bold">
          請先登入
        </Typography>
      </Box>
    )

  return (
    <Paper
      key={'paper'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { md: '80%', xs: ' 100%' },
        height: '100%',
        maxWidth: 'xl',
        m: { md: '1rem auto', xs: '0' },
        p: '2rem',
        backgroundColor: '#F9F5E3',
      }}
    >
      <Typography variant="h4" sx={{ alignSelf: 'center' }} fontWeight="bold">
        新增課程
      </Typography>
      {/* <Box display="flex" flexDirection="row" sx={{ ml: '12%' }}>
        <Typography variant="h4" sx={{ mt: '20%' }} fontWeight="bold">
          新增課程
        </Typography> */}
      {/* <img src="https://i.imgur.com/6QxVhMt.png" width={500} height="auto" /> */}
      {/* </Box> */}
      <Box justifyContent="start" flexDirection="column" sx={{ ml: '25%' }}>
        <Box flexDirection="column">
          <h2>課程名稱</h2>
          <TextField
            required
            error={titleError}
            helperText={titleError ? '請輸入課程名稱' : ''}
            value={title}
            id="outlined-required"
            label="名稱"
            style={{ backgroundColor: '#F4F2F3', borderRadius: '5px' }}
            onChange={handleChangeTitle}
          />
        </Box>
        <Box flexDirection="column">
          <h2>簡介</h2>
          <TextField
            id="filled-basic"
            label="說明"
            multiline
            color="primary"
            style={{ backgroundColor: '#F4F2F3', borderRadius: '5px' }}
            onChange={handleChangeDescription}
          />
        </Box>
        <Box flexDirection="column">
          <h2>開放時間</h2>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={{ start: '開始', end: '結束' }}
          >
            <DatePicker
              label="開始日期"
              value={startDate}
              onChange={(newStart) => setStartDate(newStart)}
              sx={{ mr: 2, backgroundColor: '#F4F2F3' }}
            />
            <DatePicker
              label="結束日期"
              value={endDate}
              onChange={(newEnd) => setEndDate(newEnd)}
              sx={{ mr: 2, backgroundColor: '#F4F2F3' }}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={{ mt: 5, mb: 6 }}>
          <LoadingButton
            loading={submitLoading}
            variant="contained"
            size="medium"
            onClick={() => {
              console.log('log')
              handelSubmit()
            }}
          >
            新增課程
          </LoadingButton>
          <Typography>
            {title} {description}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}
