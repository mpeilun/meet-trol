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
import { useState, useEffect, useRef, SetStateAction, Dispatch } from 'react'
import { useRouter } from 'next/router'
import { Video } from '../../../../types/video-edit'
import { ViewLog } from '@prisma/client'
import TimeRangeSlider from '../../../../components/analyze/video-timeline'
import dynamic from 'next/dynamic'
import { PlayerProgress, ReactPlayerType } from '../../../../types/react-player'
import { OnProgressProps } from 'react-player/base'
import h337, { Heatmap } from '@mars3d/heatmap.js'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

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

  const [video, setVideo] = useState<Video>(null)
  const [viewLog, setViewLog] = useState<ViewLog[]>([])

  const playerBoxRef = useRef<HTMLDivElement>(null)
  const heatmapRef = useRef<Heatmap<'value', 'x', 'y'>>(null)

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
      const data = await res.json()
      setViewLog(data)
    }
    fetchVideo()
    fetchViewLog()
  }, [router.isReady])

  const [selectRange, setSelectRange] = useState([0, 5])

  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const play = () => setPlaying(true)
  const pause = () => setPlaying(false)
  const [playerProgress, setPlayerProgress] = useState(initPlayerProgress)

  const [reactPlayer, setReactPlayer] = useState<ReactPlayerType>(null)

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

  //init heatmap
  useEffect(() => {
    if (ready && !heatmapRef.current) {
      heatmapRef.current = h337.create({
        container: document.querySelector('#analyze-player'),
      })
    }
  }, [ready])

  //update heatmap
  useEffect(() => {
    if (heatmapRef?.current != null && playerProgress.playedSeconds > 0) {
      // now generate some random data
      var points = []
      var max = 0
      var width = document.querySelector('#analyze-player').clientWidth
      var height = document.querySelector('#analyze-player').clientHeight
      var len = 200

      while (len--) {
        var val = Math.floor(Math.random() * 100)
        max = Math.max(max, val)
        var point = {
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height),
          value: val,
        }
        points.push(point)
      }
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

  if (!video || viewLog.length === 0) {
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
      <span
        style={{
          backgroundColor: 'red',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          position: 'absolute',
          top: '500px',
          left: '1000px',
        }}
      ></span>
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
              <Box
                position="absolute"
                zIndex={1}
                width={playerBoxRef.current?.clientWidth}
                height={playerBoxRef.current?.clientHeight}
                onClick={() => {
                  playing ? pause() : play()
                }}
              />
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
            <Box>
              {/*時間軸*/}
              <TimeRangeSlider
                sx={{ width: '100%', padding: '10px 0 10px 0' }}
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
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AnalyzeVideoPage
