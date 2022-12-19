import * as React from 'react'
import { useRouter } from 'next/router'
import { Dayjs } from 'dayjs'
import { TextField, Box } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

function SerachCoursesPage() {
  const [value, setValue] = React.useState<Dayjs | null>(null)
  const router = useRouter()

  return (
    <Box sx={{ m: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', width: '300px', height: '100px' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="選擇日期"
          value={value}
          onChange={(newValue) => {
            setValue(newValue)
            if (newValue) {
              router.push(`courses/${newValue.year()}/${newValue.month() + 1}/${newValue.date()}`)
            }
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Box>
  )
}

export default SerachCoursesPage
