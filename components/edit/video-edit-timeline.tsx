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
import { PlayerProgress, ReactPlayerType } from '../../types/react-player'

function formatTime(value) {
  dayjs.extend(duration)
  return dayjs.duration(value, 'seconds').format('HH:mm:ss')
}

interface VideoRangeSliderProps {
  sx?: SxProps<Theme>
  reactPlayer: ReactPlayerType
  playerProgress: PlayerProgress
  start?: number
  end?: number
  onSelectRangeChange?: (start: number, end: number) => void
}

function VideoRangeSlider(props: VideoRangeSliderProps) {
  const { sx, reactPlayer, playerProgress, start, end, onSelectRangeChange } =
    props

  const [currentSeconds, setCurrentSeconds] = useState(0)
  const [selectRange, setSelectRange] = useState([start ?? 0, end ?? 40])

  useEffect(() => {
    if (playerProgress.playedSeconds == currentSeconds) return
    startTransition(() => {
      setCurrentSeconds(playerProgress.playedSeconds)
    })
  }, [playerProgress.playedSeconds])

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return
    }

    if (activeThumb === 0) {
      setSelectRange([Math.min(newValue[0], selectRange[1]), selectRange[1]])
    } else {
      setSelectRange([selectRange[0], Math.max(newValue[1], selectRange[0])])
    }

    if (onSelectRangeChange) {
      onSelectRangeChange(selectRange[0], selectRange[1])
    }
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

  //TODO 0308
  //Youtube Link 調整位置
  //在 Devtools 會跑版

  return (
    <>
      <Box sx={sx} margin={'0 0 36px 0'}>
        <CustomizedSlider
          value={currentSeconds}
          onChange={(event, newValue: number) => {
            setCurrentSeconds(newValue)
            reactPlayer?.getInternalPlayer().seekTo(newValue)
          }}
          max={playerProgress.duration}
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
          value={selectRange}
          onChange={handleChange}
          max={playerProgress.duration}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatTime(value)}
          disableSwap
          marks={[
            { value: 0, label: formatTime(0) },
            {
              value: playerProgress.duration,
              label: formatTime(playerProgress.duration),
            },
          ]}
        />
      </Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* 影片長度 */}
        <Box display="flex" margin={'8px 0 8px 0'}>
          {/* 開始時間 */}
          <TimeField
            label={'開始時間'}
            value={dayjs().startOf('day').add(selectRange[0], 'second')}
            minTime={dayjs().startOf('day')}
            maxTime={dayjs().startOf('day').add(selectRange[1], 'second')}
            onChange={(newValue: Dayjs) => {
              if (
                covertToSecond(newValue) <= selectRange[1] &&
                covertToSecond(newValue) >= 0
              ) {
                setSelectRange([covertToSecond(newValue), selectRange[1]])
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
            value={dayjs().startOf('day').add(selectRange[1], 'second')}
            minTime={dayjs().startOf('day').add(selectRange[0], 'second')}
            maxTime={dayjs()
              .startOf('day')
              .add(playerProgress.duration, 'second')}
            onChange={(newValue: Dayjs) => {
              if (
                covertToSecond(newValue) <= playerProgress.duration &&
                covertToSecond(newValue) >= selectRange[0]
              ) {
                setSelectRange([selectRange[0], covertToSecond(newValue)])
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
