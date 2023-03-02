import * as React from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { setPlayedSecond } from '../../store/course-data'
// import dynamic from 'next/dynamic';
import { YouTubePlayerProps } from 'react-player/youtube'
// const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false });
import ReactPlayer from 'react-player/youtube'
import Slide from '@mui/material/Slide'
// import Slider from '@mui/material/Slider'

import { Box, ButtonBase, Slider, SliderProps, Grid } from '@mui/material'
import {
  PlayArrow,
  Pause,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material'

import PopupModal from '../popup/popupModel'
import PopupFab from '../popup/popupFab'

import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { OnProgressProps } from 'react-player/base'

import { Info } from '@prisma/client'
import {
  VideoData,
  InteractionData,
  ChoiceData,
  RankData,
  FillData,
  DragData,
} from '../../types/chapter'

interface ReactPlayerOnProgressProps {
  played: number
  playedSeconds: number
  loaded: number
  loadedSeconds: number
}

// DATA
interface questionList {
  startTime: number
  endTime: number
  questionType: number
  questionTitles: string
  questionChoice?: Array<string>
  isAnswer: boolean
}

function CoursePlayer() {
  //PlayerController
  const url = 'https://www.youtube.com/watch?v=1iHURb6K4qc'
  const [progress, setProgress] = React.useState('')
  const playerRef: any = React.useRef<ReactPlayer>(null)
  const containerRef = React.useRef(null)
  const [showPlayerBar, setShowPlayerBar] = React.useState(false)
  const [mouseEnter, setMouseEnter] = React.useState(false)
  const [playerControllerProps, setPlayerControllerProps] = React.useState({
    width: 0,
    height: 0,
  })
  const [playing, setPlaying] = React.useState(false)
  const play = () => setPlaying(true)
  const pause = () => setPlaying(false)
  const [videoDuration, setVideoDuration] = React.useState(0)
  const [timer, setTimer] = React.useState<any>(null)

  const handle = useFullScreenHandle()

  //redux
  const videoId = useAppSelector((state) => state.course.videoId)
  const videoTime = useAppSelector((state) => state.course.videoTime)
  const dispatch = useAppDispatch()
  const [videoData, setVideoData] = React.useState<VideoData>()
  const [interactionData, setInteractionData] =
    React.useState<(Info | ChoiceData | RankData | FillData | DragData)[]>()

  React.useEffect(() => {
    console.log('fetch video data')
    const fetchData = async () => {
      let interactionData = []
      const response = await fetch(`http://localhost:3000/api/video/${videoId}`)
      const data: VideoData = await response.json()
      console.log(data)
      setVideoData(data)
      data.info.map((info) => interactionData.push(info))
      data.choice.map((choice) => interactionData.push(choice))
      data.fill.map((fill) => interactionData.push(fill))
      data.rank.map((rank) => interactionData.push(rank))
      data.drag.map((drag) => interactionData.push(drag))
      // console.log(interactionData)
      setInteractionData(interactionData)
    }
    fetchData()
  }, [videoId])

  //Slider

  const [playedSeconds, setPlayedSeconds] = React.useState(0)
  const handleSliderChange = (event: any, newValue: any) => {
    setPlayedSeconds(newValue)
    playerRef.current.seekTo(newValue, 'seconds')
  }
  const onReady = React.useCallback(
    (time: number) => {
      playerRef.current.seekTo(time, 'seconds')
    },
    [playerRef.current]
  )

  // 是否顯示 Fab

  let onPlayerReady = () => {
    if (playerRef.current != null) {
      console.log(playerRef.current)
      setPlayerControllerProps({
        width: playerRef.current.props.width,
        height: playerRef.current.props.height,
      })
      setVideoDuration(playerRef.current.getDuration())
    }
  }

  let handlePlayerStatus = (props: ReactPlayerOnProgressProps) => {
    setPlayedSeconds(props.playedSeconds)
    dispatch(setPlayedSecond(props.playedSeconds))

    // if (videoData != undefined) {
    //   // console.log(interactionData)
    //   interactionData.map((data, index) => {
    //     if (
    //       props.playedSeconds >= data.start &&
    //       props.playedSeconds <= data.end
    //     ) {
    //       setShowFab(data.questionType)
    //     }
    //   })
    // }

    // console.log(props.playedSeconds)
    // console.log(playerRef.current.props.height)
    // console.log(playerRef.current.props.width)
  }
  // console.log('render')
  return (
    <FullScreen handle={handle}>
      <Box
        sx={{ position: 'relative', width: '100%', height: '100%' }}
        className="course-player-div"
        onMouseOver={() => {
          setShowPlayerBar(true)
          setMouseEnter(true)
        }}
        onMouseLeave={() => {
          setMouseEnter(false)
          setShowPlayerBar(false)
        }}
      >
        {/* 自訂播放bar */}

        <Box
          className="course-player-bar"
          sx={{
            height: 100,
            width: '100%',
            // display: 'flex',
            // padding: 2,
            // borderRadius: 1,
            zIndex: 2,
            overflow: 'hidden',
            bottom: 0,
          }}
          ref={containerRef}
          position={'absolute'}
        >
          <Slide
            direction="up"
            in={showPlayerBar}
            container={containerRef.current}
          >
            <div style={{ height: '100%', width: '100%' }}>
              <div style={{ height: 50, position: 'relative' }}>
                <Slider
                  sx={{ position: 'absolute', bottom: -15, zIndex: 1000 }}
                  value={playedSeconds}
                  onChange={handleSliderChange}
                  min={0}
                  max={playerRef.current ? playerRef.current.getDuration() : 0}
                  step={0.1}
                />
              </div>
              <div
                style={{
                  // width: playerControllerProps.width,
                  // height: `calc(${playerControllerProps.height} * 0.15)`,
                  width: '100%',
                  height: 50,
                  backgroundColor: 'gray',
                  opacity: '80%',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <ButtonBase
                  sx={{ height: 50, width: 50 }}
                  onClick={() => {
                    playing ? pause() : play()
                  }}
                >
                  {playing ? <Pause /> : <PlayArrow />}
                </ButtonBase>
                <ButtonBase
                  sx={{ height: 50, width: 50 }}
                  onClick={handle.active ? handle.exit : handle.enter}
                >
                  {handle.active ? <FullscreenExit /> : <Fullscreen />}
                </ButtonBase>
              </div>
            </div>
          </Slide>
        </Box>
        {interactionData != undefined && (
          <Box
            sx={{
              visibility: 'hidden',
              height: '100%',
              width: '100%',
              left: '5%',
              top:'10%',
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              
            }}
          >
            {interactionData.map((data) => {
              return (
                <>
                  <PopupFab pause={pause} play={play} data={data}></PopupFab>
                </>
              )
            })}
          </Box>
        )}
        {/* {showComponent && (
          <PopupFab
            setClose={handleClosePopupModal}
            setOpen={handleOpenPopupModal}
            open={openPopupModal}
            questionType={questionType}
          ></PopupFab>
        )} */}
        <ReactPlayer
          url={videoData == undefined ? '' : videoData.url}
          playing={playing}
          onPlay={play}
          onPause={pause}
          onProgress={handlePlayerStatus}
          ref={playerRef}
          onReady={onPlayerReady}
          width={'100%'}
          height={handle.active ? '100%' : 600}
          progressInterval={200}
          config={{
            playerVars: { controls: 1, start: videoTime },
          }}
        ></ReactPlayer>
      </Box>
    </FullScreen>
  )
}

export default CoursePlayer
