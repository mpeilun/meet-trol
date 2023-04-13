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
import { Chapter, Video, PastView } from '@prisma/client'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { setVideoId, setVideoTime } from '../../store/course-data'
import { ChapterListData, PastViewData } from '../../types/chapter'

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

interface props {
  chapterData: ChapterListData[]
  pastViewData: PastViewData[]
  courseId: string
}

const CustomizedAccordions = ({
  chapterData,
  pastViewData,
  courseId,
}: props) => {
  // const postPastView = React.useCallback(async (videoId: string) => {
  //   await fetch(`/api/record?courseId=${courseId}&videoId=${videoId}`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       videoTime: videoTime,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     // .then((data) => console.log(data))
  //     .catch((error) => console.log(error))
  // }, [])
  // React.useEffect(() => {
  //   if (!pastViewData.length) {
  //     postPastView(chapterData[0].videos[0].id)
  //   }
  // }, [])
  // console.log('chapter render')
  const lastView = React.useMemo((): PastViewData => {
    if (!pastViewData.length || !pastViewData)
      return {
        videoId: chapterData[0].videos[0].id,
        lastViewTime: new Date(),
        lastPlaySecond: 0,
      }
    const lastViewVideo = pastViewData.reduce((earliest, current) => {
      const earliestTime = new Date(earliest.lastViewTime)
      const currentTime = new Date(current.lastViewTime)
      return earliestTime > currentTime ? earliest : current
    }, pastViewData[0])
    return lastViewVideo
  }, [chapterData, pastViewData])

  const dispatch = useAppDispatch()



  const initialSelectVideo = React.useMemo((): boolean[][] => {
    let chapterList = []
    const initialSelected = () => {
      chapterData.map((chapter, index) => {
        let videoList = []
        chapter.videos.map((video, index) => {
          if (video.id == lastView.videoId) {
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

  const [selectedVideo, setSelectedVideo] =
    React.useState<boolean[][]>(initialSelectVideo)

  const initialExpanded = React.useMemo((): boolean[] => {
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

  const [isExpanded, setIsExpanded] = React.useState<boolean[]>(initialExpanded)

  React.useEffect(() => {
    dispatch(setVideoId(lastView.videoId))
    dispatch(setVideoTime(Math.round(lastView.lastPlaySecond)))
  }, [])

  const handleChange =
    (index: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      let expanded = [...isExpanded]
      expanded[index] = !expanded[index]
      setIsExpanded(expanded)
    }

  const getLastView = async (videoId: string) => {
    await fetch(`/api/record?courseId=${courseId}&videoId=${videoId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          dispatch(setVideoTime(Math.round(data.lastPlaySecond)))
        } else {
          dispatch(setVideoTime(0))
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div id="chapter-list">
      {chapterData.map(({ title, videos }, indexOne) => {
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
                          if (!selectedVideo[indexOne][indexTwo]) {
                            getLastView(id)
                            let selected = [...selectedVideo]
                            selected.map((ele) => {
                              ele.fill(false)
                            })
                            selected[indexOne][indexTwo] = true
                            setSelectedVideo(selected)
                            dispatch(setVideoId(id))
                          }
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
                              backgroundColor: selectedVideo[indexOne][indexTwo]
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

export default CustomizedAccordions
