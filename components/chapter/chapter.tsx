import * as React from 'react'
import { styled } from '@mui/material/styles'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import {
  Box,
  Icon,
  Divider,
  CardActionArea,
  CardContent,
  Card,
} from '@mui/material'
import { Chapter, Video, LastView } from '@prisma/client'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { setVideoId, setVideoTime } from '../../store/course-data'
import { ChapterListData, LastViewData } from '../../types/chapter'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.8rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingLeft: theme.spacing(0),
  paddingRight: theme.spacing(0),
  paddingTop: theme.spacing(0),
  paddingBottom: theme.spacing(0),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

export default function CustomizedAccordions(props: {
  chapterData: ChapterListData[]
  lastView: LastViewData[]
}) {
  const data = props.chapterData
  const lastView = props.lastView
  // 獲得最後觀看的影片
  const lastViewVideo = lastView.reduce((earliest, current) => {
    const earliestTime = new Date(earliest.viewTime)
    const currentTime = new Date(current.viewTime)
    return earliestTime > currentTime ? earliest : current
  }, lastView[0])

  const dispatch = useAppDispatch()
  const initialSelectVideo = React.useCallback((): boolean[][] => {
    let chapterList = []
    const initialSelected = () => {
      data.map((chapter, index) => {
        let videoList = []
        chapter.videos.map((video, index) => {
          if (video.id == lastViewVideo.videoId) {
            videoList.push(true)
          } else {
            videoList.push(false)
          }
        })
        chapterList.push(videoList)
      })
    }
    initialSelected()
    return chapterList
  }, [])
  const [selectedVideo, setSelectedVideo] = React.useState<boolean[][]>(
    initialSelectVideo()
  )

  const initialExpanded = React.useCallback((): boolean[] => {
    let expandedList = []
    selectedVideo.map((selected, index) => {
      if (selected.includes(true)) {
        expandedList.push(true)
      } else {
        expandedList.push(false)
      }
    })

    return expandedList
  }, [])

  const [isExpanded, setIsExpanded] = React.useState<boolean[]>(
    initialExpanded()
  )
  const handleChange =
    (index: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      let expanded = [...isExpanded]
      expanded[index] = !expanded[index]
      setIsExpanded(expanded)
    }

  React.useEffect(() => {
    dispatch(setVideoId(lastViewVideo.videoId))
    dispatch(setVideoTime(lastViewVideo.videoTime))
  }, [])

  if (data == undefined) {
    return <></>
  } else if (data.length == 0) {
    return (
      <>
        <Typography align="center" sx={{ py: 2, fontWeight: 'bold' }}>
          課程尚未新增影片和章節
        </Typography>
      </>
    )
  } else {
    return (
      <div>
        {data.map(({ title, videos }, indexOne) => {
          return (
            <Accordion
              key={indexOne}
              expanded={isExpanded[indexOne]}
              onChange={handleChange(indexOne)}
            >
              <AccordionSummary
                aria-controls={`panel${indexOne + 1}d-content`}
                id={`panel${indexOne + 1}d-header`}
              >
                <Box sx={{ pl: 1 }}>
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 'bold' }}>
                    {title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {videos.map(({ title, id }, indexTwo) => {
                  let isLast = true
                  if (videos.length == indexTwo + 1) {
                    isLast = false
                  }
                  return (
                    <Box key={indexTwo}>
                      <Card
                        elevation={0}
                        sx={{
                          borderRadius: 0,
                          borderColor: 'transparent',
                          display: 'flex',
                        }}
                      >
                        <CardActionArea
                          onClick={() => {
                            let selected = [...selectedVideo]
                            selected.map((ele) => {
                              ele.fill(false)
                            })
                            selected[indexOne][indexTwo] = true
                            setSelectedVideo(selected)
                            const video = lastView.find(
                              (lastView) => lastView.videoId == id
                            )
                            if (video) {
                              dispatch(setVideoTime(video.videoTime))
                            } else {
                              dispatch(setVideoTime(0))
                            }
                            dispatch(setVideoId(id))
                          }}
                        >
                          <CardContent
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Box
                              sx={{
                                backgroundColor: selectedVideo[indexOne][
                                  indexTwo
                                ]
                                  ? '#67a1f3'
                                  : 'white',
                                color: selectedVideo[indexOne][indexTwo]
                                  ? '#67a1f3'
                                  : 'white',
                              }}
                            >
                              {`.`}
                            </Box>
                            <Typography
                              sx={{ ml: 1 }}
                              variant="body2"
                              component="div"
                            >
                              {title}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                      {isLast && <Divider variant="middle" />}
                    </Box>
                  )
                })}
              </AccordionDetails>
            </Accordion>
          )
        })}
      </div>
    )
  }
}
