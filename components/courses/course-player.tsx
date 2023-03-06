import * as React from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { setPlayedSecond } from '../../store/course-data'
import dynamic from 'next/dynamic'
import { ReactPlayerType } from '../../types/react-player'
import Slide from '@mui/material/Slide'

import {
  Box,
  ButtonBase,
  Slider,
  SliderProps,
  Grid,
  CircularProgress,
} from '@mui/material'
import {
  PlayArrow,
  Pause,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material'

import PopupModal from '../popup/popupModel'
import PopupFab from '../popup/popupFab'

import {
  FullScreen,
  FullScreenHandle,
  useFullScreenHandle,
} from 'react-full-screen'
import { OnProgressProps } from 'react-player/base'
import { VideoData } from '../../types/chapter'

const ReactPlayerDynamic = dynamic(() => import('react-player/lazy'), {
  loading: () => (
    <Box
      width={'100%'}
      height={'100%'}
      display={'flex'}
      justifyContent={'center'}
    >
      <CircularProgress />
    </Box>
  ),
  ssr: false,
})

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
  //ReactPlayer
  const playerRef = React.useRef<ReactPlayerType>(null) //ReactPlayer 的參照
  const [showPlayerBar, setShowPlayerBar] = React.useState(false) //是否顯示播放器控制列
  // const [mouseEnter, setMouseEnter] = React.useState(false)
  const [playing, setPlaying] = React.useState(false) //播放狀態
  const play = () => setPlaying(true) //播放
  const pause = () => setPlaying(false) //暫停
  // const [videoDuration, setVideoDuration] = React.useState(0)
  const [timer, setTimer] = React.useState<any>(null)
  const [volume, setVolume] = React.useState(1) //音量
  const handleFullScreen = useFullScreenHandle() //全螢幕控制器

  const [hasWindow, setHasWindow] = React.useState(false)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true)
    }
  }, [])

  //redux
  const videoId = useAppSelector((state) => state.course.videoId)
  const videoTime = useAppSelector((state) => state.course.videoTime)
  const dispatch = useAppDispatch()
  const [videoData, setVideoData] = React.useState<VideoData>(null)

  React.useEffect(() => {
    console.log('fetch video data')
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3000/api/video/${videoId}`)
      const data: VideoData = await response.json()
      console.log(data)
      setVideoData(data)
    }
    fetchData()
  }, [videoId])

  let handlePlayerStatus = (props: OnProgressProps) => {
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

  //Slider
  const [playedSeconds, setPlayedSeconds] = React.useState(0)
  const handleTimeSliderChange = (event: any, newValue: any) => {
    if (playedSeconds != newValue) {
      React.startTransition(() => setPlayedSeconds(newValue))
      playerRef.current.seekTo(newValue, 'seconds')
    }
  }
  const handleVolumeSliderChange = (event: any, newValue: any) => {
    if (volume != newValue) {
      setVolume(newValue)
    }
  }

  let onPlayerReady = (player: ReactPlayerType) => {
    if (playerRef) {
      playerRef.current = player
    }
  }

  return (
    <FullScreen handle={handleFullScreen}>
      {hasWindow && (
        <Box
          sx={{ position: 'relative', width: '100%', height: '100%' }}
          className="course-player-div"
          onMouseOver={() => {
            setShowPlayerBar(true)
            // setMouseEnter(true)
          }}
          onMouseLeave={() => {
            // setMouseEnter(false)
            setShowPlayerBar(false)
          }}
        >
          {/* 自訂播放bar */}

          {playerRef?.current && (
            <PlayerBar
              playerRef={playerRef}
              playedSeconds={playedSeconds}
              handleTimeSliderChange={handleTimeSliderChange}
              handleVolumeSliderChange={handleVolumeSliderChange}
              volume={volume}
              showPlayerBar={showPlayerBar}
              playing={playing}
              play={play}
              pause={pause}
              handleFullScreen={handleFullScreen}
            />
          )}

          {playerRef?.current && videoData?.question && (
            <Box
              sx={{
                visibility: 'hidden',
                height: '100%',
                width: '100%',
                left: '5%',
                top: '10%',
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {videoData?.question.map((data, index) => {
                return (
                  <PopupFab
                    key={`popupfab-${index}`}
                    pause={pause}
                    play={play}
                    data={data}
                  ></PopupFab>
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
          <ReactPlayerDynamic
            url={videoData == undefined ? '' : videoData.url}
            playing={playing}
            onPlay={play}
            onPause={pause}
            onProgress={handlePlayerStatus}
            onReady={onPlayerReady}
            volume={volume}
            width={'100%'}
            height={handleFullScreen.active ? '100%' : 600}
            progressInterval={200}
            config={{
              youtube: {
                playerVars: {
                  start: videoTime,
                  // 此參數指定從影片開始播放時起算的秒數，表示播放器應停止播放影片的時間。參數值為正整數。
                  // 請注意，時間是從影片開頭算起，而非從 start 播放器參數的值或 startSeconds 參數 (用於在 YouTube Player API 函式中載入或排入影片)。
                  controls: 0, // 0, 播放器控制項不會顯示播放器的控制項。
                  modestbranding: 0,
                  // 此參數可用來避免未顯示 YouTube 標誌的 YouTube 播放器。將參數值設為 1
                  // 可避免在控制列中顯示 YouTube 標誌。請注意，當使用者的滑鼠遊標懸停在播放器上時，暫停顯示的右上角仍會顯示小型的 YouTube 文字標籤。
                  rel: 0, // 0, 相關影片則會從播放過的影片來自同一個頻道。
                },
              },
            }}
          />
        </Box>
      )}
    </FullScreen>
  )
}

export default CoursePlayer

// 播放器播放條
interface PlayerBarProps {
  showPlayerBar: boolean
  playedSeconds: number
  handleTimeSliderChange: (event: Event, value: number | number[]) => void
  handleVolumeSliderChange: (event: Event, value: number | number[]) => void
  playerRef: React.MutableRefObject<ReactPlayerType | null>
  playing: boolean
  volume: number
  play: () => void
  pause: () => void
  handleFullScreen: FullScreenHandle
}
const PlayerBar = (props: PlayerBarProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const {
    showPlayerBar,
    playedSeconds,
    handleTimeSliderChange,
    handleVolumeSliderChange,
    playerRef,
    playing,
    play,
    pause,
    handleFullScreen,
    volume,
  } = props
  return (
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
      <Slide direction="up" in={showPlayerBar} container={containerRef.current}>
        <div style={{ height: '100%', width: '100%' }}>
          <div style={{ height: 50, position: 'relative' }}>
            <Slider
              sx={{ position: 'absolute', bottom: -15, zIndex: 1000 }}
              value={playedSeconds}
              onChange={handleTimeSliderChange}
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
            <Box width={'100%'} height={'100%'} display="flex">
              <Slider
                sx={{ width: 100, alignSelf: 'center' }}
                value={volume}
                onChange={handleVolumeSliderChange}
                min={0}
                max={1}
                step={0.05}
              />
            </Box>

            <ButtonBase
              sx={{ height: 50, width: 50 }}
              onClick={
                handleFullScreen.active
                  ? handleFullScreen.exit
                  : handleFullScreen.enter
              }
            >
              {handleFullScreen.active ? <FullscreenExit /> : <Fullscreen />}
            </ButtonBase>
          </div>
        </div>
      </Slide>
    </Box>
  )
}
