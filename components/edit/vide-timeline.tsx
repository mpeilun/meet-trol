import {
  Box,
  Button,
  Card,
  Slider,
  SliderTrack,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material'
import { Dispatch, ReactNode, SetStateAction, useEffect } from 'react'
import { SelectType } from '../../pages/courses/edit/question/[id]'
import { allQuestion, Video } from '../../types/video-edit'
import { formatSeconds, questionStyle } from '../../util/common'
import { PriceChange } from '@mui/icons-material'

function VideoTimeLine(props: {
  video: Video
  allQuestion: allQuestion
  duration: number
  select: SelectType
  setSelect: Dispatch<SetStateAction<SelectType>>
  selectRange: number[]
  setSelectRange: Dispatch<SetStateAction<[number, number]>>
}) {
  const {
    video,
    allQuestion,
    duration,
    select,
    setSelect,
    selectRange,
    setSelectRange,
  } = props

  useEffect(() => {
    console.log('new value', allQuestion)
  }, [allQuestion])

  return (
    <Box padding={3}>
      {allQuestion.map((question, index) => {
        const { icon, displayName, color } = questionStyle(
          question.questionType
        )
        const width = (
          ((question.end - question.start) * 100) /
          duration
        ).toFixed(0)
        const left = ((question.start * 100) / duration).toFixed(0)
        const selectStartLeft = ((selectRange[0] * 100) / duration).toFixed(0)
        const selectEndLeft = ((selectRange[1] * 100) / duration).toFixed(0)
        //TODO 修好紅線跟蹤時間
        return (
          <Box
            key={question.id}
            display="flex"
            flexDirection={'row'}
            padding={'4px 0 4px 0'}
          >
            <Box
              margin={'0 8px 0 0'}
              width={'40px'}
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              {icon}
              <Typography>{displayName.substring(0, 2)}</Typography>
            </Box>
            <div
              style={{
                position: 'relative',
                left: `${selectStartLeft}%`,
                borderLeft: '2px solid red',
                height: '100px',
              }}
            />
            <div
              style={{
                position: 'relative',
                left: `${selectEndLeft}%`,
                borderLeft: '2px solid red',
                height: '100px',
              }}
            />
            <Card
              sx={{
                cursor: 'pointer',
                width: '100%',
                boxShadow: index === select.value ? 3 : 'none',
                bgcolor: alpha(color, 0.2),
              }}
              onClick={() => {
                setSelect({ value: index, initQuestion: question })
                setSelectRange([question.start, question.end])
                console.log(question.start, question.end)
                window.scrollTo({ top: 64, behavior: 'smooth' })
              }}
            >
              <Tooltip
                title={
                  <Typography variant="body2">
                    {formatSeconds(question.end)}
                  </Typography>
                }
                placement={'right'}
              >
                <>
                  <Tooltip
                    title={
                      <Typography variant="body2">
                        {formatSeconds(question.start)}
                      </Typography>
                    }
                    placement={'left'}
                  >
                    <>
                      <Tooltip
                        title={
                          <Box>
                            <Typography
                              maxWidth={'100px'}
                              textOverflow={'ellipsis'}
                              overflow={'hidden'}
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {question.title}
                            </Typography>
                          </Box>
                        }
                        arrow
                      >
                        <Card
                          sx={{
                            height: '60px',
                            position: 'relative',
                            left: `${left}%`,
                            width: `${width}%`,
                            boxShadow: 'none',
                            bgcolor: color,
                          }}
                        />
                      </Tooltip>
                    </>
                  </Tooltip>
                </>
              </Tooltip>
            </Card>
          </Box>
        )
      })}
    </Box>
  )
}

export default VideoTimeLine
