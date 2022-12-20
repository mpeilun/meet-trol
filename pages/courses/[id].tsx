import * as React from 'react'
import { useRouter } from 'next/router'
import ReactPlayer from 'react-player/youtube'
import Slide from '@mui/material/Slide';

import { CourseDataType, getCourseById } from '../../dummy-data'
import { Box, Button, ButtonBase, Card, Chip, Fab } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Choice from '../../components/question/choice';

interface ReactPlayerOnProgressProps {
  played: number,
  playedSeconds: number,
  loaded: number,
  loadedSeconds: number
}
let questionHadClosed = false

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

  //Question
  const [question, setQuestion] = React.useState(<></>)
  const [displayQuestion, setDisplayQuesiton] = React.useState(false)
  const [displayFab, setDisplayFab] = React.useState(false)

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
  }

  let handlePlayerStatus = (props: ReactPlayerOnProgressProps) => {
    if (props.playedSeconds > 14.0 && props.playedSeconds < 18.0) {
      if (!questionHadClosed&&!displayQuestion) {
        pause()
        setDisplayQuesiton(true)
        console.log(`${questionHadClosed} 第一次開 + ${props.playedSeconds}`)
      }
      else if (questionHadClosed){
        setDisplayFab(true)
      }
    }
    else{
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
      <Box width={'100%'}>
        <Box sx={{ position: 'relative', width: '100%' }}
          onMouseOver={() => { setMouseEnter(true) }}
          onMouseOut={() => { setMouseEnter(false) }}>
          <Box
            sx={{
              height: 50,
              width: '100%',
              display: 'flex',
              // padding: 2,
              // borderRadius: 1,
              overflow: 'hidden',
              bottom: 0
            }}
            ref={containerRef}
            position={'absolute'}
          >
            <Slide direction="up" in={mouseEnter} container={containerRef.current}>
              <div style={{ width: playerControllerProps.width, height: `calc(${playerControllerProps.height} * 0.15)`, backgroundColor: 'gray' }}>
                {/* {player bar} */}
                <ButtonBase sx={{height: '100%', width:50}}><PlayArrowIcon/></ButtonBase>
              </div>
            </Slide>

          </Box>
          <Choice displayQuestion={displayQuestion} handleQuestionClose={handleQuestionClose}></Choice>
          <Fab 
          color="primary" 
          sx={{ position: 'absolute', bottom: mouseEnter ? 70 : 20, left: 20, display: displayFab ? 'flex' : 'none', justifyContent:'center'}}
          onClick={()=>setDisplayQuesiton(true)}
          >
            <QuestionMarkIcon/>
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
      </Box>
      <Box width={300} bgcolor='#FEFFFF' display='flex' flex={{ alignItems: 'center' }} flexDirection='column'>
        <Button variant='outlined' sx={{ height: 50, width: 275, m: 1 }}>章節一</Button>
        <Button variant='outlined' sx={{ height: 50, width: 275, m: 1 }}>章節二</Button>
        <Button variant='outlined' sx={{ height: 50, width: 275, m: 1 }}>章節三</Button>
        <Button variant='outlined' sx={{ height: 50, width: 275, m: 1 }}>章節四</Button>
      </Box>
    </Box>
  )
}

export default CourseInnerPage
