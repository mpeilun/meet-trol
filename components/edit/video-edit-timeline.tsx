import React, { useState, useRef } from 'react'
import Slider, { SliderProps } from '@mui/material/Slider'
import { SxProps, Theme, Box, Button } from '@mui/material'
import { TimeField } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'

function formatTime(value) {
  dayjs.extend(duration)
  return dayjs.duration(value, 'seconds').format('HH:mm:ss')
}

function VideoRangeSlider({
  sx,
  start,
  end,
  duration,
  onTimeChange,
}: {
  sx: SxProps<Theme>
  duration: number
  start?: number
  end?: number
  onTimeChange: (start: number, end: number) => void
}) {
  const [values, setValues] = useState([start ?? 0, end ?? 20])
  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return
    }

    if (activeThumb === 0) {
      setValues([Math.min(newValue[0], values[1]), values[1]])
    } else {
      setValues([values[0], Math.max(newValue[1], values[0])])
    }

    onTimeChange(newValue[0], newValue[1])
  }
  return (
    <>
      <Slider
        sx={sx}
        value={values}
        onChange={handleChange}
        max={duration}
        disableSwap={true}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => formatTime(value)}
        marks={[
          {
            value: 0,
            label: formatTime(values[0]),
          },
          { value: duration ?? 0, label: formatTime(duration) },
        ]}
      />
      <VideoTimePicker
        values={values}
        label={'Start Time'}
        onTimeChange={(newValue) => {
          console.log(newValue)
        }}
      />
    </>
  )
}

export default VideoRangeSlider

function VideoTimePicker(props: {
  values: number[]
  label?: string
  sx?: SxProps<Theme>
  onTimeChange: (value: number[]) => void
}) {
  dayjs.extend(duration)
  const timeFieldRef = useRef<HTMLInputElement>(null)
  const [timePicker, setTimePicker] = useState<Dayjs | null>(
    dayjs().second(props.values[0])
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
      </LocalizationProvider>
    </>
  )
}
