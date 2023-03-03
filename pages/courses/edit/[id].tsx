import { JSONTree } from 'react-json-tree'
import ReactPlayer from 'react-player/youtube'
import {
  Box,
  Button,
  TextField,
  Typography,
  Tabs,
  Tab,
  Card,
  Paper,
  CircularProgress,
} from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useRouter } from 'next/router'
import { OnProgressProps } from 'react-player/base'
import CreateChoice from '../../../components/question/choice/create'
import TestVideoEditTimeLine from '../../../components/edit/video-edit-timeline'
import { Video } from '../../../types/video-edit'

import { Info, Choice, Rank, Fill, Drag } from '@prisma/client'

export interface PlayerProgress extends OnProgressProps {
  duration: number
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function useVideo(id: string) {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data, error, isLoading, mutate } = useSWRImmutable(
    `/api/video/edit/${id}`,
    fetcher
  )

  const isError: null | { message: string | null } =
    error || data?.message
      ? { message: `${data?.message} ${error ? error : ''}` }
      : null

  return { video: data as Video, isLoading, isError, mutate }
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function EditQuestionPage() {
  const router = useRouter()
  const { id } = router.query as { id: string }

  // for testing id
  // 63f45bbf82f16bcec3a6381a

  const { video, isError, isLoading, mutate } = useVideo(id)

  const setVideoUrl = (url: string) => {
    mutate({ ...video, url: url })
  }
  // const fetcher = (url: string) => fetch(url).then((r) => r.json())
  // const { data, error, isLoading } = useSWR<Video>(
  //   `/api/video/edit/${id}`,
  //   fetcher
  // )

  const [tabValue, setTabValue] = useState(0)
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const playerRef = useRef<ReactPlayer>(null)
  const [hasWindow, setHasWindow] = useState(false)
  const [playing, setPlaying] = useState(false)
  const play = () => setPlaying(true)
  const pause = () => setPlaying(false)
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(null)

  const handlePlayerStatus = (props: OnProgressProps) => {
    setPlayerProgress((prev) => {
      const fixedProps = Object.fromEntries(
        Object.entries(props).map(([key, value]) => [key, value.toFixed(2)])
      )
      return { ...prev, ...fixedProps }
    })
  }

  const handelPlayerDuration = (duration: number) => {
    setPlayerProgress((prev) => {
      return { ...prev, duration }
    })
  }

  const handPlayerReady = () => {}

  //fix react player hydration issue
  //https://stackoverflow.com/questions/72235211/trying-to-use-react-player-throws-a-hydration-error
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true)
    }
  }, [])

  if (isLoading) {
    return <CircularProgress />
  }

  if (isError) {
    return <Typography variant="h5"> message: {isError.message} </Typography>
  }

  return (
    <>
      <Box display="flex" flexDirection="column">
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
          <Box width="45%">
            {/*播放器*/}
            {hasWindow && ReactPlayer.canPlay(video.url) && (
              <ReactPlayer
                style={
                  {
                    // display: 'flex',
                  }
                }
                url={video.url}
                playing={playing}
                onPlay={play}
                onPause={pause}
                onProgress={handlePlayerStatus}
                onDuration={handelPlayerDuration}
                ref={playerRef}
                onReady={handPlayerReady}
                width={'100%'}
                progressInterval={200}
                config={{
                  playerVars: {
                    showinfo: 0,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                  },
                }}
              />
            )}
            {/*網址輸入框*/}
            <TextField
              fullWidth
              label="Youtube Link"
              variant="outlined"
              value={video.url}
              size="small"
              sx={{ m: '24px 0' }}
              onChange={(event) => {
                setVideoUrl(event.target.value)
              }}
            />
          </Box>
          {/*出題區塊*/}
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '45%',
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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          m={2}
        >
          {hasWindow && <TestVideoEditTimeLine />}
          {/* <VideoEditTimeLine />
          <VideoEditTimeLine /> */}
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              if (playerRef.current) {
                playerRef.current.seekTo(50)
              }
            }}
          >
            setPlayerProgress
          </Button>
          <Box>
            <Typography>秒數 {playerProgress?.playedSeconds}</Typography>
            <Typography>進度 {playerProgress?.played}</Typography>
            <Typography>影片時長 {playerProgress?.duration}</Typography>
          </Box>
        </Box>
        <JSONTree data={video} />
      </Box>
    </>
  )
}

export default EditQuestionPage
