import * as React from 'react'
// import dynamic from 'next/dynamic';
import { YouTubePlayerProps } from 'react-player/youtube'
// const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false });
import ReactPlayer from 'react-player/youtube'
import Slide from '@mui/material/Slide'

import { Box, ButtonBase } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

interface ReactPlayerOnProgressProps {
  played: number
  playedSeconds: number
  loaded: number
  loadedSeconds: number
}

function CoursePlayer() {
  //PlayerController
  const url = 'https://www.youtube.com/watch?v=1iHURb6K4qc'
  const [progress, setProgress] = React.useState('')
  const playerRef: any = React.useRef<ReactPlayer>(null)
  const containerRef = React.useRef(null)
  const [mouseEnter, setMouseEnter] = React.useState(false)
  const [playerControllerProps, setPlayerControllerProps] = React.useState({
    width: 0,
    height: 0,
  })
  const [playing, setPlaying] = React.useState(false)
  const play = () => setPlaying(true)
  const pause = () => setPlaying(false)
  const [videoDuration, setVideoDuration] = React.useState(0)

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
    setProgress(`playedSeconds: ${props.playedSeconds}`)
    // console.log(playerRef.current.props.height)
    // console.log(playerRef.current.props.width)
  }

  return (
    <Box
      sx={{ position: 'relative', width: '100%' }}
      className="course-player-div"
      onMouseOver={() => {
        setMouseEnter(true)
      }}
      onMouseOut={() => {
        setMouseEnter(false)
      }}
    >
      {/* 自訂播放bar */}

      {/* <Box
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
                {player bar}
                <Slider
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
                />
                <ButtonBase sx={{ height: 50, width: 50 }} onClick={() => { playing ? pause() : play() }}>
                  {playing ? <PauseIcon /> : <PlayArrowIcon />}
                </ButtonBase>
              </div>
            </Slide>
          </Box> */}

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
        config={{
          playerVars: { controls: 1 },
        }}
      />
    </Box>
  )
}

export default CoursePlayer
