import { JSONTree } from 'react-json-tree'
import {
  Box,
  Button,
  TextField,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Select,
  IconButton,
} from '@mui/material'
import {
  useState,
  useEffect,
  useRef,
  SetStateAction,
  Dispatch,
  useCallback,
} from 'react'
import { useRouter } from 'next/router'
import { Video } from '../../../../types/video-edit'
import TimeRangeSlider from '../../../../components/analyze/video-timeline'
import dynamic from 'next/dynamic'
import { PlayerProgress, ReactPlayerType } from '../../../../types/react-player'
import { OnProgressProps } from 'react-player/base'
import h337, { Heatmap } from '@mars3d/heatmap.js'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import ViewChart from '../../../../components/analyze/view-chart'
import { ViewLog } from '../../../../types/videoLog'
import { calculateXY, scaleXY, transformXY } from '../../../../util/calculate'

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

const initPlayerProgress: PlayerProgress = {
  played: 0,
  playedSeconds: 0,
  loaded: 0,
  loadedSeconds: 0,
  duration: 0,
}

function AnalyzeVideoPage() {
  const router = useRouter()
  const { courseId, videoId } = router.query

  // Fetch video and view log
  const [video, setVideo] = useState<Video>(null)
  const [viewLog, setViewLog] = useState<ViewLog>(null)
  useEffect(() => {
    if (!router.isReady) return
    const fetchVideo = async () => {
      const res = await fetch(`/api/video/edit/${videoId}`)
      const data = await res.json()
      setVideo(data)
    }
    const fetchViewLog = async () => {
      const res = await fetch(
        `/api/record/log?courseId=${courseId}&videoId=${videoId}`
      )
      const data: ViewLog = await res.json()
      setViewLog(data)
      console.log(data)
    }
    fetchVideo()
    fetchViewLog()
  }, [router.isReady])

  // Player state
  const [selectRange, setSelectRange] = useState([0, 5])
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [playerProgress, setPlayerProgress] = useState(initPlayerProgress)
  const [reactPlayer, setReactPlayer] = useState<ReactPlayerType>(null)
  const playerBoxRef = useRef<HTMLDivElement>(null)

  const play = () => setPlaying(true)
  const pause = () => setPlaying(false)

  // Player event handler
  const handlePlayerProgress = (props: OnProgressProps) => {
    // const currentFocus = viewLog

    // viewLog.forEach((v) =>
    //   v.eyesTrack.forEach((e) => {
    //     if (e.focus.playSecond == props.playedSeconds) console.log(e.focus)
    //   })
    // )

    setPlayerProgress((prev) => {
      return { ...prev, ...props }
    })
  }

  const handelPlayerDuration = (duration: number) => {
    setPlayerProgress((prev) => {
      return { ...prev, duration }
    })
  }

  const handelPlayerReady = (player: ReactPlayerType) => {
    {
      setReady(true)
      setReactPlayer(player)
    }
  }

  // Init heatmap
  const heatmapRef = useRef<Heatmap<'value', 'x', 'y'>>(null)
  useEffect(() => {
    if (ready && !heatmapRef.current) {
      heatmapRef.current = h337.create({
        container: document.querySelector('#analyze-player'),
        blur: 0.8,
      })
      document
        .querySelector('.heatmap-canvas')
        .setAttribute(
          'style',
          'position: absolute; top: 0; left: 0; pointer-events: none;'
        )
    }
  }, [ready])

  const videoX = useRef<number>()
  const videoY = useRef<number>()
  const videoW = useRef<number>()
  const videoH = useRef<number>()

  const playerXY = useCallback(() => {
    if (playerBoxRef.current) {
      const playerW = playerBoxRef.current.clientWidth
      const playerH = playerBoxRef.current.clientHeight
      const playerX = playerBoxRef.current.offsetLeft
      const playerY = playerBoxRef.current.offsetTop
      console.log(playerW, playerH, playerX, playerY)
      const { newPlayerX, newPlayerY, newPlayerW, newPlayerH } = calculateXY(
        playerX,
        playerY,
        playerW,
        playerH
      )
      videoX.current = newPlayerX
      videoY.current = newPlayerY
      videoW.current = newPlayerW
      videoH.current = newPlayerH
    }
  }, [playerBoxRef.current?.clientWidth])
  useEffect(() => {
    playerXY()
  }, [playerXY])
  // Update heatmap
  useEffect(() => {
    if (
      heatmapRef?.current != null &&
      playerProgress.playedSeconds > 0 &&
      viewLog
    ) {
      // now generate some random data
      var points = []
      var max = 0
      // console.log(playerWidth, playerHeight, playerX, playerY)
      // console.log(viewLog[Math.floor(playerProgress.playedSeconds)])

      viewLog[Math.floor(playerProgress.playedSeconds)].map((v) => {
        const widthBlackBlock = videoX.current - playerBoxRef.current.offsetLeft
        const heightBlackBlock = videoY.current - playerBoxRef.current.offsetTop
        const { x, y } = scaleXY(
          v.x,
          v.y,
          v.playerW,
          v.playerH,
          videoW.current,
          videoH.current
        )
        const point = {
          x: Math.floor(x + widthBlackBlock),
          y: Math.floor(y + heightBlackBlock),
          value: 1,
        }
        points.push(point)
      })

      // heatmap data format
      var data = {
        min: 0,
        max: max,
        data: points,
      }
      // if you have a set of datapoints always use setData instead of addData
      // for data initialization
      heatmapRef.current.setData(data)
    }
  }, [playerProgress.playedSeconds])

  // Chart
  const data = []
  for (let i = 0; i < 760; i++) {
    data.push({ viewer: Math.floor(Math.random() * 31) })
  }
  const maxViewer = data.reduce((max, item) => {
    return item.viewer > max ? item.viewer : max
  }, 0)
  const minViewer = data.reduce((min, item) => {
    return item.viewer < min ? item.viewer : min
  }, Infinity)

  if (!video || !viewLog) {
    return (
      <CircularProgress
        sx={{
          display: 'block',
          margin: '24px auto',
        }}
      />
    )
  }

  if (video?.message) {
    return <Typography variant="h5"> message: {video.message} </Typography>
  }

  return (
    <>
      <Box display="flex" flexDirection="column" padding={2}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="flex-start"
          // height="100%"
        >
          <Box width="80%">
            {/*播放器*/}
            <Box ref={playerBoxRef}>
              {/* <Box
                position="absolute"
                zIndex={1}
                width={playerBoxRef.current?.clientWidth}
                height={playerBoxRef.current?.clientHeight}
                onClick={() => {
                  playing ? pause() : play()
                }}
              /> */}
              <ReactPlayerDynamic
                id={'analyze-player'}
                fallback={<div>loading...</div>}
                url={video.url}
                playing={playing}
                onPlay={play}
                onPause={pause}
                onProgress={handlePlayerProgress}
                onDuration={handelPlayerDuration}
                onReady={handelPlayerReady}
                onError={(e) => setReady(false)}
                width={'100%'}
                height={'35vw'}
                progressInterval={200}
                config={{
                  youtube: {
                    playerVars: {
                      controls: 1,
                      modestbranding: 1,
                      rel: 0,
                    },
                  },
                }}
              />
            </Box>
            <Box
              position={'relative'}
              width={'100%'}
              height={maxViewer + 20}
              maxHeight={'60px'}
              top={'37px'}
            >
              <ViewChart data={data} />
            </Box>
            <Box>
              {/*時間軸*/}
              <TimeRangeSlider
                sx={{ width: '100%', padding: '0 0 10px 0' }}
                reactPlayer={reactPlayer}
                playerProgress={playerProgress}
                url={video.url}
                start={selectRange[0]}
                end={selectRange[1]}
                onUrlChange={(url) => {
                  setVideo((prev) => {
                    return { ...prev, url: url }
                  })
                }}
                onSelectRangeChange={(startTime, endTime) => {
                  setSelectRange([startTime, endTime])
                }}
              ></TimeRangeSlider>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AnalyzeVideoPage
