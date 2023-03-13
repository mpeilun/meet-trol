import {
  Box,
  Button,
  Slider,
  SliderTrack,
  Tooltip,
  Typography,
} from '@mui/material'
import { ReactNode } from 'react'
import { allQuestion } from '../../types/video-edit'
import { formatSeconds } from '../../util/common'
import { questionStyle } from '../popup/popupFab'

function CustomTrack(props: { children: ReactNode; other: any }) {
  const { children, ...other } = props
  return (
    <SliderTrack {...other}>
      {children}
      {/* <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Typography sx={{ color: '#111' }}>Test</Typography>
      </Box> */}
    </SliderTrack>
  )
}

function VideoTimeLineTest(props: {
  allQuestion: allQuestion
  duration: number
}) {
  const { allQuestion, duration } = props

  return (
    <>
      <Slider
        sx={{
          padding: '0px',
          '& .MuiSlider-markLabel': {
            display: 'relative',
            top: '-20px',
            padding: '0 20px 0 20px',
          },
        }}
        max={duration}
        marks={[
          { value: 0, label: formatSeconds(0) },
          {
            value: duration,
            label: formatSeconds(duration),
          },
        ]}
        disabled
      />
      {allQuestion.map((question, index) => {
        return (
          <Box key={question.id}>
            <Box display={'flex'} flexDirection={'row'} mt={1}>
              {questionStyle(question.questionType).icon}
              <Typography sx={{ marginLeft: '4px' }}>
                {question.title}
              </Typography>
            </Box>
            <Slider
              sx={{
                color: questionStyle(question.questionType).color,
                height: '60px',
                padding: '0px',
                boxShadow: 'none !important',
                '& .MuiSlider-thumb': {
                  display: 'none',
                },
                '& .MuiSlider-mark': {
                  display: 'none',
                },
                '& .MuiSlider-markLabel': {
                  display: 'none',
                },
              }}
              value={[question.start, question.end]}
              valueLabelDisplay="off"
              max={duration}
              onChange={(event, newValue) => {
                console.log('triggered')
              }}
            />
          </Box>
        )
      })}
    </>
  )
}

export default VideoTimeLineTest
