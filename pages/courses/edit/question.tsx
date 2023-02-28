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
} from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import { OnProgressProps } from 'react-player/base'
import CreateChoice from '../../../components/question/choice/create'

export interface PlayerProgress extends OnProgressProps {
  duration: number
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
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
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const playerRef = useRef<ReactPlayer>(null)
  const [hasWindow, setHasWindow] = useState(false)
  const [playerUrl, setPlayerUrl] = useState(
    'https://www.youtube.com/watch?v=1iHURb6K4qc'
  )
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
          <Box
            width="50%"
            // sx={{ m: '1rem 1rem 1rem 2rem' }}
          >
            {/*播放器*/}
            {hasWindow && ReactPlayer.canPlay(playerUrl) && (
              <ReactPlayer
                style={{
                  display: 'flex',
                }}
                url={playerUrl}
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
              label="Youtube Link"
              variant="outlined"
              value={playerUrl}
              size="small"
              sx={{ m: '24px 0' }}
              onChange={(event) => {
                setPlayerUrl(event.target.value)
              }}
            />
          </Box>
          {/*出題區塊*/}
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              // m: '1rem 2rem 1rem 1rem',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="資訊" {...a11yProps(0)} />
                <Tab label="選擇" {...a11yProps(1)} />
                <Tab label="填空" {...a11yProps(2)} />
                <Tab label="排序" {...a11yProps(3)} />
                <Tab label="圖選" {...a11yProps(4)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              #資訊卡
            </TabPanel>
            <TabPanel value={value} index={1}>
              #選擇題
              <CreateChoice />
            </TabPanel>
            <TabPanel value={value} index={2}>
              #填空題
            </TabPanel>
            <TabPanel value={value} index={3}>
              #排序題
            </TabPanel>
            <TabPanel value={value} index={4}>
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
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              if (playerRef.current) {
                playerRef.current.seekTo(50.11111)
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
      </Box>
    </>
  )
}

export default EditQuestionPage
