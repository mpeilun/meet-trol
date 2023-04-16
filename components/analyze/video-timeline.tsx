import React, {
  useState,
  useRef,
  useEffect,
  startTransition,
  ReactNode,
} from 'react'
import Slider, {
  SliderProps,
  SliderValueLabel,
  SliderValueLabelProps,
} from '@mui/material/Slider'
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
  TextField,
  styled,
} from '@mui/material'
import { TimeField } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { PlayerProgress, ReactPlayerType } from '../../types/react-player'
import { formatSeconds } from '../../util/common'
import PlaceIcon from '@mui/icons-material/Place'

interface VideoRangeSliderProps {
  sx?: SxProps<Theme>
  reactPlayer: ReactPlayerType
  playerProgress: PlayerProgress
  start?: number
  end?: number
  url: string
  onUrlChange?: (url: string) => void
  onSelectRangeChange?: (start: number, end: number) => void
}

const CustomSlider = styled(Slider)(({ theme }) => ({
  padding: '0',
  margin: '0',
  position: 'relative',
  height: '24px',
  top: '12px',
  // '& .MuiSlider-track': {
  //   display: 'none',
  //   height: '100%',
  // },
  // '& .MuiSlider-rail': {
  //   display: 'none',
  //   height: '100%',
  // },
  '& .MuiSlider-thumb': {
    position: 'absolute',
    top: '-14px',
    width: '30px',
    height: '30px',
    color: 'primary.main',
    backgroundColor: 'transparent',
    boxShadow: 'none !important',
    '&::before': {
      boxShadow: 'none !important',
    },
  },
  '& .MuiSlider-valueLabel': {
    width: '72px',
    height: '100%',
    position: 'absolute',
    top: '80px',
    backgroundColor: '#c4bad3',
    borderRadius: '5px',
    '&::before': {
      content: '""',
      width: 0,
      height: 0,
      position: 'absolute',
      top: '-10px',
      left: '26px',
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: '0 10px 16px 10px',
      // Bug, #1976d2 is primary.main color, below can use theme.palette.primary.main
      borderColor: `transparent transparent #c4bad3 transparent`,
      transform: 'rotate(0deg)',
    },
  },
}))

function CustomThumb(props: { children: ReactNode; other: any }) {
  const { children, ...other } = props
  return (
    <SliderThumb {...other}>
      {children}
      <PlaceIcon sx={{ width: '100%', height: '100%' }} />
    </SliderThumb>
  )
}

function CustomValueLabel(props: SliderValueLabelProps) {
  const { children, ...other } = props
  return <SliderValueLabel {...other}>{children}</SliderValueLabel>
}

function CustomizedSlider(props: SliderProps) {
  return (
    <CustomSlider
      {...props}
      components={{
        Thumb: CustomThumb,
        ValueLabel: CustomValueLabel,
      }}
    />
  )
}

function VideoRangeSlider(props: VideoRangeSliderProps) {
  const {
    sx,
    reactPlayer,
    playerProgress,
    start,
    end,
    url,
    onUrlChange,
    onSelectRangeChange,
  } = props

  const [inputUrl, setInputUrl] = useState('')
  const [currentSeconds, setCurrentSeconds] = useState(0)
  const [selectRange, setSelectRange] = useState([start, end])

  useEffect(() => {
    setSelectRange([start, end])
  }, [start, end])

  useEffect(() => {
    setInputUrl(url)
  }, [url])

  useEffect(() => {
    if (playerProgress.playedSeconds == currentSeconds) return
    setCurrentSeconds(playerProgress.playedSeconds)
  }, [playerProgress.playedSeconds])

  const handleChange = (event, newValue) => {
    setCurrentSeconds(newValue)
    reactPlayer?.getInternalPlayer()?.seekTo(newValue)
  }

  const covertToSecond = (time: Dayjs) => {
    return time?.hour() * 3600 + time?.minute() * 60 + time?.second()
  }

  return (
    <>
      <Box sx={sx} margin={'0 0 36px 0'}>
        <CustomizedSlider
          sx={{
            position: 'relative',
            top: '8px',
            bottom: '8px',
            margin: '24px 0 0 0',
            padding: '0 0 0 0',
            height: '10px',
            boxShadow: 'none !important',
            '& .MuiSlider-markLabel': {
              position: 'absolute',
              zIndex: -1,
              top: '16px',
            },
          }}
          value={currentSeconds}
          onChange={handleChange}
          // onChangeCommitted={(event, newValue: number) => {
          //   setCurrentSeconds(newValue)
          //   reactPlayer?.getInternalPlayer()?.seekTo(newValue)
          // }}
          max={playerProgress.duration}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => formatSeconds(value)}
          disableSwap
          marks={[
            { value: 0, label: formatSeconds(0) },
            {
              value: playerProgress.duration,
              label: formatSeconds(playerProgress.duration),
            },
          ]}
        />
      </Box>
    </>
  )
}

export default VideoRangeSlider
