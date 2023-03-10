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
} from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import CreateChoice from '../../../components/question/choice/create'
import { Video } from '../../../types/video-edit'
import TimeRangeSlider from '../../../components/edit/video-edit-timeline'
import dynamic from 'next/dynamic'
import { PlayerProgress, ReactPlayerType } from '../../../types/react-player'
import { OnProgressProps } from 'react-player/base'
import VideoTimeLine from '../../../components/edit/video-timeline'

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

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function EditQuestionPage() {
  const router = useRouter()
  const query = router.query

  // for testing id
  // 63f45bbf82f16bcec3a6381a

  const [video, setVideo] = useState<Video>(null)

  useEffect(() => {
    if (!router.isReady) return
    const fetchVideo = async () => {
      const res = await fetch(`/api/video/edit/${query.id}`)
      const data = await res.json()
      setVideo(data)
    }
    fetchVideo()
  }, [router.isReady])

  const [tabValue, setTabValue] = useState(0)
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const blockLeft = useRef<HTMLDivElement>(null)
  // const playerRef = useRef<ReactPlayerType>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const play = () => setPlaying(true)
  const pause = () => setPlaying(false)
  const [playerProgress, setPlayerProgress] = useState(initPlayerProgress)

  const [reactPlayer, setReactPlayer] = useState<ReactPlayerType>(null)

  const handlePlayerProgress = (props: OnProgressProps) => {
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

  if (!video) {
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
        <Typography variant="h5" sx={{ mb: 2, mt: 2 }}>
          創建題目
        </Typography>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="flex-start"
          // height="100%"
        >
          {/* 影片區塊 左側 */}
          <Box width="45%" ref={blockLeft}>
            {/* 提示：請輸入正確的Youtube網址 */}
            {/* {!ready && (
              <Box
                position={'absolute'}
                width={'45%'}
                height={'100%'}
                display={'flex'}
                justifyContent={'center'}
              >
                <CircularProgress />
              </Box>
            )} */}
            {/*播放器*/}
            <ReactPlayerDynamic
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
            <Box>
              {/*時間軸*/}
              <TimeRangeSlider
                sx={{ width: '100%', padding: '10px 0 10px 0' }}
                reactPlayer={reactPlayer}
                playerProgress={playerProgress}
                url={video.url}
                onUrlChange={(url) => {
                  setVideo((prev) => {
                    return { ...prev, url: url }
                  })
                }}
                // start={500}
                // end={600}
                // onSelectRangeChange={(startTime, endTime) => {
                // console.log(startTime, endTime)
                // }}
              />
            </Box>
          </Box>
          {/* 出題區塊 右側*/}
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '45%',
              minHeight: blockLeft?.current?.clientHeight ?? '480px',
              maxHeight: blockLeft?.current?.clientHeight ?? '480px',
              overflow: 'auto',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="basic tabs example"
              >
                <Tab label="資訊" {...a11yProps(0)} />
                <Tab label="選擇" {...a11yProps(1)} />
                <Tab label="填空" {...a11yProps(2)} />
                <Tab label="排序" {...a11yProps(3)} />
                <Tab label="圖選" {...a11yProps(4)} />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              #資訊卡
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              #選擇題
              <CreateChoice
                playerProgress={playerProgress}
                setPlayerProgress={setPlayerProgress}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              #填空題
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              #排序題
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              #圖片選答
            </TabPanel>
          </Paper>
        </Box>

        {/*測試區塊*/}
        {
          <VideoTimeLine
            allQuestion={video.question}
            duration={playerProgress.duration}
          />
        }
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          m={3}
        ></Box>
        <JSONTree data={video} />
      </Box>
    </>
  )
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, mb: 1 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default EditQuestionPage
