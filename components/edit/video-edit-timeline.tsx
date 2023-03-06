import React, {
  useState,
  useRef,
  useEffect,
  startTransition,
  ReactNode,
} from 'react'
import Slider, { SliderProps } from '@mui/material/Slider'
import {
  SxProps,
  Theme,
  Box,
  Button,
  Collapse,
  Typography,
  Card,
  CardActionArea,
  SliderThumb,
} from '@mui/material'
import { TimeField } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import CustomizedSlider from './customized-slider'

function formatTime(value) {
  dayjs.extend(duration)
  return dayjs.duration(value, 'seconds').format('HH:mm:ss')
}

function VideoRangeSlider({
  sx,
  title,
  questionType,
  now,
  start,
  end,
  duration,
  onTimeChange,
  seekTo,
}: {
  sx: SxProps<Theme>
  title: string
  questionType: string
  now?: number
  start?: number
  end?: number
  duration: number
  onTimeChange: (start: number, end: number) => void
  seekTo: (time: number) => void
}) {
  const [values, setValues] = useState([start ?? 0, end ?? 40])
  const [nowTime, setNowTime] = useState(now ?? 0)

  useEffect(() => {
    if (now == nowTime) return
    setNowTime(now)
  }, [now])

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

  const timerButtonSx: SxProps<Theme> = {
    height: '50%',
    p: 0,
    borderRadius: 0.5,
    maxWidth: '20px',
    minWidth: '20px',
    maxHeight: '20px',
    minHeight: '20px',
  }

  const covertToSecond = (time: Dayjs) => {
    return time?.hour() * 3600 + time?.minute() * 60 + time?.second()
  }

  return (
    <>
      <Box sx={sx}>
        <CustomizedSlider
          value={nowTime}
          onChange={(event, newValue: number) => {
            if (nowTime == newValue) return
            startTransition(() => {
              setNowTime(newValue)
              seekTo(newValue)
            })
          }}
          max={duration}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => formatTime(value)}
          disableSwap
          // marks={[{ value: now, label: formatTime(now) }]}
        />

        <Slider
          sx={{
            paddingBottom: '0',
            // '.MuiSlider-mark': { width: '8px' },
            // '.MuiSlider-rail': { width: '8px' },
            '.MuiSlider-thumb': {
              width: '8px',
              height: '20px',
              borderRadius: '5%',
              boxShadow: 'none',
            },
          }}
          value={values}
          onChange={handleChange}
          max={duration}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatTime(value)}
          disableSwap
          // marks={[{ value: now, label: formatTime(now) }]}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent={'space-between'}
          >
            {/* 影片長度 */}
            {/* 開始時間 */}
            <Box display="flex" flexDirection="row">
              <TimeField
                variant="standard"
                label={'開始時間'}
                value={dayjs().startOf('day').add(values[0], 'second')}
                minTime={dayjs().startOf('day')}
                maxTime={dayjs().startOf('day').add(values[1], 'second')}
                onChange={(newValue: Dayjs) => {
                  if (
                    covertToSecond(newValue) <= values[1] &&
                    covertToSecond(newValue) >= 0
                  ) {
                    setValues([covertToSecond(newValue), values[0]])
                  }
                }}
                format="HH:mm:ss"
                sx={{
                  maxWidth: '120px',
                  minWidth: '120px',
                  display: 'flex',
                }}
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
                    if (values[0] + 60 <= values[1]) {
                      setValues((prev) => [prev[0] + 60, prev[1]])
                    }
                  }}
                >
                  <ArrowDropUpOutlinedIcon />
                </Button>
                <Button
                  variant="contained"
                  sx={{ ...timerButtonSx, mt: 0.25 }}
                  onClick={() => {
                    if (values[0] - 60 >= 0) {
                      setValues((prev) => [prev[0] - 60, prev[1]])
                    }
                  }}
                >
                  <ArrowDropDownOutlinedIcon />
                </Button>
              </Box>
            </Box>
            {/* 結束時間 */}
            <Box display="flex" flexDirection="row">
              <TimeField
                variant="standard"
                label={'結束時間'}
                value={dayjs().startOf('day').add(values[1], 'second')}
                minTime={dayjs().startOf('day').add(values[0], 'second')}
                maxTime={dayjs().startOf('day').add(duration, 'second')}
                onChange={(newValue: Dayjs) => {
                  if (
                    covertToSecond(newValue) <= duration &&
                    covertToSecond(newValue) >= values[0]
                  ) {
                    setValues([covertToSecond(newValue), values[1]])
                  }
                }}
                format="HH:mm:ss"
                sx={{
                  maxWidth: '120px',
                  minWidth: '120px',
                  display: 'flex',
                }}
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
                    if (values[1] + 60 <= duration) {
                      setValues((prev) => [prev[0], prev[1] + 60])
                    }
                  }}
                >
                  <ArrowDropUpOutlinedIcon />
                </Button>
                <Button
                  variant="contained"
                  sx={{ ...timerButtonSx, mt: 0.25 }}
                  onClick={() => {
                    if (values[1] - 60 >= values[0]) {
                      setValues((prev) => [prev[0], prev[1] - 60])
                    }
                  }}
                >
                  <ArrowDropDownOutlinedIcon />
                </Button>
              </Box>
            </Box>
          </Box>
        </LocalizationProvider>
      </Box>
    </>
  )
}

export default VideoRangeSlider
