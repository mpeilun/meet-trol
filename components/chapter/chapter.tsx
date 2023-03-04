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
import { ChapterListData } from '../../types/chapter'

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
}) {
  const data = props.chapterData
  console.log('get chapter data from course')
  console.log(data)

  const dispatch = useAppDispatch()
  // const setSelected = (
  //   index: number,
  //   indexOne: number = -1,
  //   indexTwo: number = -1,
  //   videoId: string = ''
  // ): boolean[][] | boolean[] => {
  //   let isSelectedOne: Array<Array<boolean>> = []
  //   let expandedArray: Array<boolean> = []
  //   for (let i = 0; i < data.length; i++) {
  //     let isSelectedTwo: Array<boolean> = []
  //     for (let j = 0; j < data[i].videos.length; j++) {
  //       if (indexOne == i && indexTwo == j) {
  //         isSelectedTwo.push(true)
  //       } else if (videoId == data[i].videos[j].id) {
  //         isSelectedTwo.push(true)
  //       } else {
  //         isSelectedTwo.push(false)
  //       }
  //     }
  //     isSelectedOne.push(isSelectedTwo)
  //     if (isSelectedOne[i].includes(true)) {
  //       expandedArray.push(true)
  //     } else {
  //       expandedArray.push(false)
  //     }
  //   }

  //   if (index == 0) {
  //     return isSelectedOne
  //   } else if (index == 1) {
  //     return expandedArray
  //   }
  // }

  // const [videoSelect, setVideoSelect] = React.useState<boolean[][] | boolean[]>(
  //   setSelected(0)
  // )

  // const [expanded, setExpanded] = React.useState<boolean[][] | boolean[]>(
  //   setSelected(1)
  // )

  React.useEffect(() => {
    // const fetchData = async () => {
    //   const [data] = await Promise.all([fetchRecord()])
    //   if (data.length > 0) {
    //     const lastViewVideo = data.reduce((earliest, current) => {
    //       const earliestTime = new Date(earliest.viewTime)
    //       const currentTime = new Date(current.viewTime)

    //       return earliestTime > currentTime ? earliest : current
    //     }, data[0])
    //     const id = lastViewVideo.videoId
    //     const time = lastViewVideo.videoTime
    //     setVideoSelect(setSelected(0, -1, -1, id))
    //     dispatch(setVideoId(id))
    //     dispatch(setVideoTime(time))
    //   }
    // }
    // fetchData()
    console.log('set initial video')
    dispatch(setVideoId(data[0].videos[0].id))
  }, [])

  // const fetchRecord = async () => {
  //   if (data != undefined) {
  //     return fetch(`http://localhost:3000/api/record/${data[0].courseId}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.length > 0) {
  //           const lastView: LastView[] = data[0].lastView
  //           return lastView
  //         } else return []
  //       })
  //   }
  // }

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
            <Accordion key={indexOne} onChange={() => {}}>
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
                            // setVideoSelect(setSelected(0, indexOne, indexTwo))
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
                            // sx={{
                            //   backgroundColor: videoSelect[indexOne][
                            //     indexTwo
                            //   ]
                            //     ? '#67a1f3'
                            //     : 'white',
                            //   color: videoSelect[indexOne][indexTwo]
                            //     ? '#67a1f3'
                            //     : 'white',
                            // }}
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
        {/* <Accordion>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Box sx={{ pl: 1 }}>
              <Typography sx={{ fontWeight: 'bold' }}>章節一</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box py={1.5} display="flex" justifyContent="space-between">
              <Typography variant="body2">TQC+ 101</Typography>
            </Box>
            <Divider />
            <Box py={1.6} display="flex" justifyContent="space-between">
              <Typography variant="body2">TQC+ 102</Typography>
            </Box>
            <Divider />
            <Box py={1.5} display="flex" justifyContent="space-between">
              <Typography variant="body2">TQC+ 103</Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Box sx={{ pl: 1 }}>
              <Typography sx={{ fontWeight: 'bold' }}>章節二</Typography>
            </Box>{' '}
          </AccordionSummary>
          <AccordionDetails>
            <Typography>test</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <Box sx={{ pl: 1 }}>
              <Typography sx={{ fontWeight: 'bold' }}>章節三</Typography>
            </Box>{' '}
          </AccordionSummary>
          <AccordionDetails>
            <Typography>test</Typography>
          </AccordionDetails>
        </Accordion> */}
      </div>
    )
  }
}
