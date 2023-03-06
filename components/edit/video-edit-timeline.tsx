import React, { useState } from 'react'
import Slider, { SliderProps } from '@mui/material/Slider'
import { SxProps, Theme } from '@mui/material'

function formatTime(value) {
  const hours = Math.floor(value / 3600)
  const formattedHours = `${hours < 10 ? '0' : ''}${hours}`

  const minutes = Math.floor((value % 3600) / 60)
  const formattedMinutes = `${minutes < 10 ? '0' : ''}${minutes}`

  const seconds = Math.floor(value % 60)
  const formattedSeconds = `${seconds < 10 ? '0' : ''}${seconds}`

  return `${
    formattedHours == '00' ? '' : formattedHours + ':'
  }${formattedMinutes}:${formattedSeconds}`
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
          label: formatTime(duration).length > 5 ? '00:00:00' : '00:00',
        },
        { value: duration ?? 0, label: formatTime(duration) },
      ]}
    />
  )
}

export default VideoRangeSlider
