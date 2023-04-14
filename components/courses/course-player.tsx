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
  Typography,
  Modal,
} from '@mui/material'
import {
  PlayArrow,
  Pause,
  Fullscreen,
  FullscreenExit,
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
  VolumeOff,
  VolumeDown,
  VolumeUp,
  AddComment,
} from '@mui/icons-material'

import PopupModal from '../popup/popupModel'
import PopupFab from '../popup/popupFab'

import {
  FullScreen,
  FullScreenHandle,
  useFullScreenHandle,
} from 'react-full-screen'
import { OnProgressProps } from 'react-player/base'
import {
  ChoiceData,
  DragData,
  FillData,
  RankData,
  VideoData,
} from '../../types/chapter'
import CreateDiscussion from '../discussion/createDiscussion'

import {
  ViewLog,
  PauseTime,
  DragTime,
  WatchTime,
  InteractionLog,
  Info,
  Focus,
  EyesTrack,
} from '@prisma/client'
import { useSpring, animated } from '@react-spring/web'
import { useWindowDimensions } from '../../hooks/common'
import Interaction from '../popup/interaction'
import { GoogleForm } from '../docs/googleForm'

const ReactPlayerDynamic = dynamic(() => import('react-player/lazy'), {
  loading: () => (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  ),
  ssr: false,
})

function CoursePlayer(props: { courseId: string }) {
  //ReactPlayer
  // console.log('playerRender')
  const time = React.useRef(new Date())
  const timePause = React.useRef<Date>(new Date()) //暫停時間
  const playerRef = React.useRef<ReactPlayerType>(null) //ReactPlayer 的參照
  const [showPlayerBar, setShowPlayerBar] = React.useState(false) //是否顯示播放器控制列
  // const [mouseEnter, setMouseEnter] = React.useState(false)
  const [playing, setPlaying] = React.useState(false) //播放狀態
  const [playedSeconds, setPlayedSeconds] = React.useState(0)
  // console.log(playedSeconds)
  const play = React.useCallback(() => {
    // console.log(playedSeconds)
    setPlaying(true)
    pauseTimes.current.push({
      pauseTime: timePause.current,
      playTime: new Date(),
      playSecond: Math.round(playedSeconds),
    })
    // console.log(pauseTime.current)
  }, [playedSeconds]) //播放
  const pause = React.useCallback(() => {
    setPlaying(false)
    timePause.current = new Date()
  }, []) //暫停
  // const [videoDuration, setVideoDuration] = React.useState(0)
  const [timer, setTimer] = React.useState<any>(null)
  const [volume, setVolume] = React.useState(1) //音量
  const handleFullScreen = useFullScreenHandle() //全螢幕控制器
  const [playbackRate, setPlaybackRate] = React.useState(1.0) //播放速度
  const [displayCreateDiscussion, setDisplayCreateDiscussion] =
    React.useState(false) //是否顯示新增討論區
  const viewPort = useWindowDimensions()
  const playRef = React.useRef(null)

  // viewLog data

  const playerSize = React.useRef(null)
  const eyesTracks = React.useRef<EyesTrack[]>([])
  const pauseTimes = React.useRef<PauseTime[]>([])
  const dragTimes = React.useRef<DragTime[]>([])
  const interactionLog = React.useRef<InteractionLog[]>([])

  //TODO 暫時先這樣寫
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false)
  const [showInComplete, setShowInComplete] = React.useState(false)

  const [hasWindow, setHasWindow] = React.useState(false)

  const courseId = props.courseId
  //redux
  const videoId = useAppSelector((state) => state.course.videoId)
  const eyeTracking = useAppSelector((state) => state.course.eyeTracking)
  const videoTime = useAppSelector((state) => state.course.videoTime)

  const dispatch = useAppDispatch()
  const [videoData, setVideoData] = React.useState<VideoData>(null)

  React.useEffect(() => {
    if (playerRef.current) {
      setLoading(true)
      // postLog()
    }
    const fetchData = async () => {
      const response = await fetch(`/api/video/${videoId}`)
      const data: VideoData = await response.json()
      setVideoData(data)
    }
    const isValidObjectId =
      typeof videoId === 'string' &&
      videoId.length === 24 &&
      /^[a-f0-9]+$/i.test(videoId)
    if (isValidObjectId) {
      fetchData()
    }
  }, [videoId])
  // 監聽離開事件

  const postLog = async () => {
    if (interactionLog.current.length > 2 && showInComplete) {
      await fetch(`/api/record/log?courseId=${courseId}&videoId=${videoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastPlaySecond: Math.round(playedSeconds),
          eyesTrack: eyesTracks.current,
          pauseTimes: pauseTimes.current,
          dragTimes: dragTimes.current,
          watchTime: {
            start: { playSecond: Math.round(videoTime), time: time.current },
            end: { playSecond: Math.round(playedSeconds), time: new Date() },
          },
          interactionLog: interactionLog.current,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          eyesTracks.current = []
          pauseTimes.current = []
          dragTimes.current = []
          interactionLog.current = []
          time.current = new Date()
          return console.log(data)
        })
        .catch((error) => console.error(error))
    }
  }

  let handlePlayerStatus = (props: OnProgressProps) => {
    //TODO 暫時先這樣寫
    // console.log(interactionLog.current)
    if (props.playedSeconds > 732) {
      if (interactionLog.current.length > 2) {
        handleFullScreen.exit()
        setPlaying(false)
        setShowInComplete(true)
        postLog()
      }
    }
    // if (Math.floor(props.playedSeconds) % 10 == 0) {
    // }
    else if (eyesTracks && playerSize && viewPort) {
      const left: number = playerSize.current.getBoundingClientRect().left
      const top: number = playerSize.current.getBoundingClientRect().top
      const width: number = playerSize.current.getBoundingClientRect().width
      const height: number = playerSize.current.getBoundingClientRect().height
      eyesTracks.current.push({
        x: eyeTracking.x,
        y: eyeTracking.y,
        playerX: left,
        playerY: top,
        playerW: width,
        playerH: height,
        windowsW: viewPort.width,
        windowsH: viewPort.height,
        focus: {
          playSecond: Math.round(props.playedSeconds),
          onWindow: document.visibilityState === 'visible',
        },
        time: new Date(),
      })
    }

    // if (videoData) {
    //   videoData.questions.map((question) => {
    //     if (
    //       question.start < props.playedSeconds &&
    //       question.end > props.playedSeconds
    //     ) {
    //       dispatch(setQuestionLocate(question))
    //     }
    //   })
    // }
    // console.log(pauseTimes.current)
    // console.log(eyesTracks.current)
    // console.log(interactionLog)
    setPlayedSeconds(props.playedSeconds)
    dispatch(setPlayedSecond(props.playedSeconds))
  }

  //Slider
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
  const handleChangeCommitted = (event, newValue) => {
    dragTimes.current.push({
      playSecond: Math.round(playedSeconds),
      time: new Date(),
    })
  }

  const [loading, setLoading] = React.useState(true)

  const onPlayerReady = (player: ReactPlayerType) => {
    if (playerRef) {
      playerRef.current = player
      setPlayedSeconds(videoTime)
      playerRef.current.seekTo(videoTime, 'seconds')
      setLoading(false)

      // var availableQualityLevels=player.getInternalPlayer().getAvailableQualityLevels()
      // console.log(availableQualityLevels)
    }
  }


  // hide cursor when mouse is not moving
  const [isMouseMoving, setIsMouseMoving] = React.useState(true)
  const timerRef = React.useRef(null)

  const handleMouseMove = React.useCallback(() => {
    setIsMouseMoving(true)
    setShowPlayerBar(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setShowPlayerBar(false)
      setIsMouseMoving(false)
    }, 1500) // Set timeout for 5 seconds
  }, [])

  const [height, setHeight] = React.useState(600)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true)
    }

    const updateHeight = () => {
      const height = window.innerHeight / 1.35
      setHeight(height)
    }
    updateHeight()

    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = '請正確提交後測表單在離開此頁面！'
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('resize', updateHeight)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  return (
    <div style={{ cursor: isMouseMoving ? 'default' : 'none' }}>
      <FullScreen handle={handleFullScreen}>
        {/* TODO 暫時先這樣寫 */}
        <Modal open={showInComplete} disableAutoFocus>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: showInComplete && !isFormSubmitted ? '90%' : 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            {showInComplete && (
              <GoogleForm
                formType="postTest"
                isFormSubmitted={isFormSubmitted}
                setIsFormSubmitted={setIsFormSubmitted}
              />
            )}
          </Box>
        </Modal>
        {/*眼動儀*/}
        {/* <Box
      position={'absolute'}
      left={questionLocate.xStart}
      top={questionLocate.yStart}
      zIndex={2 ^ 53}
      width={questionLocate.w}
      height={questionLocate.h}
      border={'2px solid yellow'}
    >
      Test
    </Box> */}
        {hasWindow && (
          <Box
            ref={playerSize}
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
            className="course-player-div"
            onMouseMove={handleMouseMove}
            onMouseOver={() => {
              setShowPlayerBar(isMouseMoving)
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
                questions={videoData.questions}
                playerRef={playerRef}
                playedSeconds={playedSeconds}
                handleTimeSliderChange={handleTimeSliderChange}
                handleVolumeSliderChange={handleVolumeSliderChange}
                handleChangeCommitted={handleChangeCommitted}
                volume={volume}
                setVolume={setVolume}
                showPlayerBar={showPlayerBar}
                playing={playing}
                play={play}
                pause={pause}
                handleFullScreen={handleFullScreen}
                playbackRate={playbackRate}
                setPlaybackRate={setPlaybackRate}
                setDisplayCreateDiscussion={setDisplayCreateDiscussion}
              />
            )}
            {/* {playerRef?.current && videoData?.questions && !loading && (
          <Interaction
            play={play}
            pause={pause}
            interactionData={videoData.questions}
          ></Interaction>
        )} */}
            {playerRef?.current && videoData?.questions && (
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
                {videoData?.questions.map((data, index) => {
                  return (
                    <PopupFab
                      interactionLog={interactionLog}
                      key={`popupfab-${index}`}
                      pause={pause}
                      play={play}
                      data={data}
                      isFullScreen={handleFullScreen.active}
                    ></PopupFab>
                  )
                })}
              </Box>
            )}

            {loading && (
              <Box
                sx={{
                  zIndex: 10,
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            )}

            <div
              className="course-player"
              style={{ width: '100%', height: '100%' }}
            >
              <Box
                position="absolute"
                width={'100%'}
                onClick={() => {
                  playing ? pause() : play()
                }}
                height={handleFullScreen.active ? '100%' : height}
              />
              <ReactPlayerDynamic
                url={videoData == undefined ? '' : videoData.url}
                playing={playing}
                // onPlay={play}
                // onPause={pause}
                onProgress={handlePlayerStatus}
                onReady={onPlayerReady}
                volume={volume}
                width={'100%'}
                height={handleFullScreen.active ? '100%' : height}
                progressInterval={1000}
                playbackRate={playbackRate}
                config={{
                  youtube: {
                    playerVars: {
                      showInfo: 0,
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
            </div>
            {/* {playerRef?.current && (
          <CreateDiscussion
            duration={playerRef.current.getDuration()}
            displayCreateDiscussion={displayCreateDiscussion}
            setDisplayCreateDiscussion={setDisplayCreateDiscussion}
            timing={playedSeconds}
            courseId={courseId}
            chapterId={videoData.chapterId}
          />
        )} */}
          </Box>
        )}
      </FullScreen>
    </div>
  )
}

export default CoursePlayer

// 播放器播放條
interface PlayerBarProps {
  questions: (Info | ChoiceData | RankData | FillData | DragData)[]
  showPlayerBar: boolean
  playedSeconds: number
  handleTimeSliderChange: (event: Event, value: number | number[]) => void
  handleVolumeSliderChange: (event: Event, value: number | number[]) => void
  handleChangeCommitted: (
    event: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => void
  playerRef: React.MutableRefObject<ReactPlayerType | null>
  playing: boolean
  volume: number
  setVolume: (value: number) => void
  play: () => void
  pause: () => void
  handleFullScreen: FullScreenHandle
  playbackRate: number
  setPlaybackRate: (value: number) => void
  setDisplayCreateDiscussion: (value: boolean) => void
}
const PlayerBar = (props: PlayerBarProps) => {
  interface Mark {
    value: number
    // label: string
  }
  const buttonSize = { width: 50, height: 50 }
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [marks, setMarks] = React.useState<Array<Mark>>([])
  const [thumbnailUrl, setThumbnailUrl] = React.useState<string>('')
  const {
    questions,
    showPlayerBar,
    playedSeconds,
    handleTimeSliderChange,
    handleVolumeSliderChange,
    handleChangeCommitted,
    playerRef,
    playing,
    play,
    pause,
    handleFullScreen,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
    setDisplayCreateDiscussion,
  } = props
  const handleVolumeButtonClick = () => {
    if (volume == 0) {
      setVolume(1)
    } else {
      setVolume(0)
    }
  }
  const volumeIcon = (volume: number) => {
    if (volume == 0) {
      return <VolumeOff sx={{ fontSize: 30 }} />
    } else if (volume < 0.5) {
      return <VolumeDown sx={{ fontSize: 30 }} />
    } else {
      return <VolumeUp sx={{ fontSize: 30 }} />
    }
  }
  const handleDiscussionButtonClick = () => {
    // setMarks([...marks, { value: playedSeconds }])
    // console.log(marks)
    // generateImage()
    pause()
    setDisplayCreateDiscussion(true)
  }

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
              sx={{
                position: 'absolute',
                bottom: -15,
                zIndex: 1000,
                '& .MuiSlider-mark': {
                  height: '3px',
                  width: '3px',
                },
                '& .MuiSlider-markLabel': {
                  display: 'none',
                },
              }}
              value={playedSeconds}
              onChange={handleTimeSliderChange}
              onChangeCommitted={handleChangeCommitted}
              min={0}
              max={playerRef.current ? playerRef.current.getDuration() : 0}
              marks={questions.map((question) => {
                return {
                  value: question.start,
                  // label: question.questionType,
                }
              })}
              step={0.1}
            />
          </div>
          <div
            style={{
              // width: playerControllerProps.width,
              // height: `calc(${playerControllerProps.height} * 0.15)`,
              width: '100%',
              height: 50,
              backgroundColor: 'white',
              opacity: '85%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex' }}>
              <ButtonBase
                sx={{ ...buttonSize }}
                onClick={() => {
                  playing ? pause() : play()
                }}
              >
                {playing ? <Pause /> : <PlayArrow />}
              </ButtonBase>
              <ButtonBase
                sx={{ ...buttonSize }}
                onClick={handleVolumeButtonClick}
              >
                {volumeIcon(volume)}
              </ButtonBase>
              <Slider
                sx={{ width: 100, alignSelf: 'center', ml: 1 }}
                value={volume}
                onChange={handleVolumeSliderChange}
                min={0}
                max={1}
                step={0.05}
              />
              <Box
                display="flex"
                alignItems="center"
                height={50}
                ml={4}
                className="player-bar-playedsecond"
              >
                {/* format playedSeconds to mm:ss like 10:11, and under 10 sec auto fill 0 like 10:01*/}
                {Math.floor(playedSeconds / 60)}:
                {Math.floor(playedSeconds % 60) < 10
                  ? '0' + Math.floor(playedSeconds % 60)
                  : Math.floor(playedSeconds % 60)}
                /
                {playerRef.current
                  ? `${Math.floor(playerRef.current.getDuration() / 60)}:${
                      Math.floor(playerRef.current.getDuration() % 60) < 10
                        ? '0' + Math.floor(playerRef.current.getDuration() % 60)
                        : Math.floor(playerRef.current.getDuration() % 60)
                    }`
                  : '0:00'}
                {/* {playerRef.current ? playerRef.current.getDuration() : 0} */}
              </Box>
            </div>

            {/* <Box width={'100%'} height={'100%'} display="flex">
              
            </Box> */}
            <div>
              <ButtonBase
                sx={{ ...buttonSize }}
                onClick={handleDiscussionButtonClick}
              >
                <AddComment />
              </ButtonBase>
              <ButtonBase
                sx={{ ...buttonSize }}
                disabled={playbackRate <= 0.25}
                onClick={() => {
                  setPlaybackRate(playbackRate - 0.25)
                }}
              >
                <KeyboardDoubleArrowDown />
              </ButtonBase>
              {playbackRate.toFixed(2)}
              <ButtonBase
                sx={{ ...buttonSize }}
                disabled={playbackRate >= 2}
                onClick={() => {
                  setPlaybackRate(playbackRate + 0.25)
                }}
              >
                <KeyboardDoubleArrowUp />
              </ButtonBase>
              <ButtonBase
                sx={{ ...buttonSize, zIndex: 1000 }}
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
        </div>
      </Slide>
    </Box>
  )
}
