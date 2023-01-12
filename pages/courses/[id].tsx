import * as React from 'react'
import { useRouter } from 'next/router'
import ReactPlayer from 'react-player/youtube'
import Slide from '@mui/material/Slide';

import { CourseDataType, getCourseById } from '../../dummy-data'
import { Box, Button, ButtonBase, Fab, Tooltip, Typography } from '@mui/material';
import Slider, { SliderValueLabelProps } from '@mui/material/Slider';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Choice from '../../components/question/choice';
import PauseIcon from '@mui/icons-material/Pause';

import { pdfjs, Document, Page } from 'react-pdf'

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface ReactPlayerOnProgressProps {
  played: number,
  playedSeconds: number,
  loaded: number,
  loadedSeconds: number
}
let questionHadClosed = false
let loadedNumPage = false

const path = '/assets/test.pdf'

function CourseInnerPage() {
  const router = useRouter()
  const courseId = router.query.id

  //PlayerController
  const url = 'https://www.youtube.com/watch?v=1iHURb6K4qc'
  const [progress, setProgress] = React.useState('')
  const playerRef: any = React.useRef<ReactPlayer>(null)
  const containerRef = React.useRef(null)
  const [mouseEnter, setMouseEnter] = React.useState(false)
  const [playerControllerProps, setPlayerControllerProps] = React.useState({ width: 0, height: 0 })
  const [playing, setPlaying] = React.useState(false)
  const play = () => setPlaying(true)
  const pause = () => setPlaying(false)
  const [videoDuration, setVideoDuration] = React.useState(0)

  //Question
  const [question, setQuestion] = React.useState(<></>)
  const [displayQuestion, setDisplayQuesiton] = React.useState(false)
  const [displayFab, setDisplayFab] = React.useState(false)

  //PDF
  const [page, setPage] = React.useState(1)
  const [numPages, setNumPages] = React.useState(null)
  const [hoverPDF, setHoverPDF] = React.useState(false)

  function onDocumentLoadSuccess({ numPages: nextNumPages }: any) {
      setNumPages(nextNumPages);
  }

  let course: CourseDataType | undefined
  if (typeof courseId === 'string') {
    course = getCourseById(courseId)
  }
  if (!course) {
    return <p>Not Course Found!</p>
  }

  let onPlayerReady = () => {
    setPlayerControllerProps(
      {
        width: playerRef.current.props.width,
        height: playerRef.current.props.height,
      }
    )
    console.log(playerRef.current)
    setVideoDuration(playerRef.current.getDuration())
  }

  let handlePlayerStatus = (props: ReactPlayerOnProgressProps) => {
    if (props.playedSeconds > 14.0 && props.playedSeconds < 18.0) {
      if (!questionHadClosed && !displayQuestion) {
        pause()
        setDisplayQuesiton(true)
        console.log(`${questionHadClosed} 第一次開 + ${props.playedSeconds}`)
      }
      else if (questionHadClosed) {
        setDisplayFab(true)
      }
    }
    else {
      setDisplayFab(false)
    }
    setProgress(
      `playedSeconds: ${props.playedSeconds}`
    )
    // console.log(playerRef.current.props.height)
    // console.log(playerRef.current.props.width)
  }
  function handleQuestionClose() {
    questionHadClosed = true
    setDisplayQuesiton(false)
    setDisplayFab(true)
  }

  return (
    <Box display='flex' height={'100%'}>
      <Box width={'100%'} className='lesson-content' overflow='scroll'>
        <Box sx={{ position: 'relative', width: '100%' }}
          onMouseOver={() => { setMouseEnter(true) }}
          onMouseOut={() => { setMouseEnter(false) }}>



          {/* 自訂播放bar */}
          <Box
            sx={{
              height: 50,
              width: '100%',
              // display: 'flex',
              // padding: 2,
              // borderRadius: 1,
              overflow: 'hidden',
              bottom: 0
            }}
            ref={containerRef}
            position={'absolute'}
          >
            <Slide direction="up" in={mouseEnter} container={containerRef.current}>
              <div style={{ width: playerControllerProps.width, height: `calc(${playerControllerProps.height} * 0.15)`, backgroundColor: 'gray', opacity: '80%' }}>
                {/* {player bar} */}
                {/* <Slider
                  valueLabelDisplay="auto"
                  slots={{
                    valueLabel: ValueLabelComponent,
                  }}
                  aria-label="custom thumb label"
                  defaultValue={20}
                  sx={{
                    // position: 'absolute',
                    // top:-17,
                  }}
                  min={0}
                  max={videoDuration}
                /> */}
                <ButtonBase sx={{ height: 50, width: 50 }} onClick={() => { playing ? pause() : play() }}>
                  {playing ? <PauseIcon /> : <PlayArrowIcon />}
                </ButtonBase>
              </div>
            </Slide>
          </Box>


          <Choice displayQuestion={displayQuestion} handleQuestionClose={handleQuestionClose}></Choice>


          <Fab
            color="primary"
            sx={{ position: 'absolute', bottom: mouseEnter ? 70 : 20, left: 20, display: displayFab ? 'flex' : 'none', justifyContent: 'center' }}
            onClick={() => setDisplayQuesiton(true)}
          >
            <QuestionMarkIcon />
          </Fab>
          <ReactPlayer
            url={url}
            playing={playing}
            onPlay={play}
            onPause={pause}
            onProgress={handlePlayerStatus}
            ref={playerRef}
            onReady={onPlayerReady}
            width={'100%'}
            height={600}
            progressInterval={200}
          // config={{
          //     playerVars: { modestbranding: 0 }
          // }}
          />

        </Box>
        <p>{progress}</p>
        <ul>
          <li>{course.id}</li>
          <li>{course.description}</li>
          <li>{course.image}</li>
        </ul>

        <div className='pdf-controller-div'
        style={{ position: 'relative', height: 800}} onMouseEnter={()=>setHoverPDF(true)} onMouseLeave={()=>setHoverPDF(false)}>
          {/* <embed src={path} type='application/pdf' width={'100%'} height={1000}></embed> */}
          <Document file={path} onLoadSuccess={onDocumentLoadSuccess}>
            {/* {Array.from({ length: numPages! }, (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderAnnotationLayer={true}
                renderTextLayer={true}
              />
            ))} */}
            <Page key={`page_${page + 1}`} pageNumber={page} renderAnnotationLayer={true} renderTextLayer={true} />
          </Document>
          <Box
          className='pdf-controller-box'
            position='absolute'
            left={'50%'}
            bottom='5%'
            bgcolor='white'
            mx={'auto'}
            display='flex'
            alignItems='center'
            sx={{ transform: 'translateX(-50%)',
             transition: 'opacity ease-in-out 0.2s',
             opacity: hoverPDF?100:0,
             }}>
            <Button sx={{ width: 50, height: 50 }} onClick={()=>setPage(page-1)} disabled={page==1}><KeyboardArrowLeft /></Button>
            <Typography color='black'>第{page}頁</Typography>
            <Button sx={{ width: 50, height: 50 }} onClick={()=>setPage(page+1)} disabled={page==numPages}><KeyboardArrowRight /></Button>
          </Box>
        </div>
      </Box>
      <Box className='lesson-bar' width={300} bgcolor='#FEFFFF' display='flex' sx={{ alignItems: 'center' }} flexDirection='column'>
        <Button variant='outlined' sx={{ height: 50, width: 275, m: 1 }}>章節一</Button>
        <Button variant='outlined' sx={{ height: 50, width: 275, m: 1 }}>章節二</Button>
        <Button variant='outlined' sx={{ height: 50, width: 275, m: 1 }}>章節三</Button>
        <Button variant='outlined' sx={{ height: 50, width: 275, m: 1 }}>章節四</Button>
      </Box>
    </Box>
  )
}

export default CourseInnerPage

function ValueLabelComponent(props: SliderValueLabelProps) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

// function PageController() {
//   return (
//     <Box
//       position='absolute'
//       left={'50%'}
//       bottom='5%'
//       bgcolor='white'
//       mx={'auto'}
//       display='flex'
//       alignItems='center'
//       sx={{ transform: 'translateX(-50%)' }}>
//       <ButtonBase sx={{ width: 50, height: 50 }}><KeyboardArrowLeft /></ButtonBase>
//       <Typography>第1頁</Typography>
//       <ButtonBase sx={{ width: 50, height: 50 }}><KeyboardArrowRight /></ButtonBase>
//     </Box>
//   )
// }