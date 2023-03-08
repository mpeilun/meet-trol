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

  //TODO 0307
  //判斷 duration, now 型態
  //開始 結束 時間設定還沒修改
  //Youtube Link 拉上來
  //修復 consol.log 錯誤
  //在devtools 看會跑版?

  return (
    <>
      <Box sx={sx} margin={'0 0 36px 0'}>
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
        />
        <Slider
          sx={{
            position: 'relative',
            bottom: '8px',
            margin: '0 0 0 0',
            padding: '0 0 0 0',
            height: '8px',
            boxShadow: 'none !important',
            '& .MuiSlider-thumb': {
              width: '8px',
              height: '20px',
              borderRadius: '5%',
              boxShadow: 'none',
            },
            '& .MuiSlider-mark': {
              display: 'none',
            },
            '& .MuiSlider-markLabel': {
              position: 'absolute',
              zIndex: -1,
              top: '16px',
            },
          }}
          value={values}
          onChange={handleChange}
          max={duration}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatTime(value)}
          disableSwap
          marks={[
            { value: 0, label: formatTime(0) },
            { value: duration, label: formatTime(duration) },
          ]}
        />
      </Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display="flex" margin={'8px 0 8px 0'}>
          {/* 影片長度 */}
          {/* 開始時間 */}

          <TimeField
            label={'開始時間'}
            value={dayjs().startOf('day').add(values[0], 'second')}
            minTime={dayjs().startOf('day')}
            maxTime={dayjs().startOf('day').add(values[1], 'second')}
            onChange={(newValue: Dayjs) => {
              if (
                covertToSecond(newValue) <= values[1] &&
                covertToSecond(newValue) >= 0
              ) {
                setValues([covertToSecond(newValue), values[1]])
              }
            }}
            format="HH:mm:ss"
            sx={{
              marginRight: '16px',
              '.MuiInputBase-input': {
                padding: '8px',
                height: '30px',
                width: '80px',
                textAlign: 'center',
              },
            }}
          />
          {/* 結束時間 */}

          <TimeField
            label={'結束時間'}
            value={dayjs().startOf('day').add(values[1], 'second')}
            minTime={dayjs().startOf('day').add(values[0], 'second')}
            maxTime={dayjs().startOf('day').add(duration, 'second')}
            onChange={(newValue: Dayjs) => {
              if (
                covertToSecond(newValue) <= duration &&
                covertToSecond(newValue) >= values[0]
              ) {
                setValues([values[0], covertToSecond(newValue)])
              }
            }}
            format="HH:mm:ss"
            sx={{
              '.MuiInputBase-input': {
                padding: '8px',
                height: '30px',
                width: '80px',
                textAlign: 'center',
              },
            }}
          />
        </Box>
      </LocalizationProvider>
    </>
  )
}

export default VideoRangeSlider
