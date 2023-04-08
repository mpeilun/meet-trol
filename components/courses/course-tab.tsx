import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import PDF from '../pdf/pdf'
import { Button, Divider, Icon } from '@mui/material'
import { KeyboardArrowDown, OpenInNew, FileDownload } from '@mui/icons-material'
import EyesTracking from '../eyetracking/eyetracking'
import Link from 'next/link'
import { Video } from '@prisma/client'
import ReplyLog from '../replyLog'
import CustomizedAccordions from '../chapter/chapter'
import { ChapterListData, PastViewData, VideoData } from '../../types/chapter'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'

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
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

interface props {
  chapterData: ChapterListData[]
  pastViewData: PastViewData[]
  courseId: string
}

export default function CourseTabs({ chapterData, pastViewData, courseId }: props) {
  const [value, setValue] = React.useState(0)
  const [windowWidth, setWindowWidth] = React.useState(1000)
  React.useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(getWindowSize().innerWidth)
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])
  const videoId = useAppSelector((state) => state.course.videoId)
  const [videoData, setVideoData] = React.useState<VideoData>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3000/api/video/${videoId}`)
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const material = ''

  const extractGoogleDriveId = (url: string) => {
    // 定義正則表達式，以匹配 Google Drive 共用網址中的 ID
    var regex = /\/(?:d|file\/d)\/([a-zA-Z0-9_-]{25,})/
    // 使用正則表達式提取 ID
    var match = url.match(regex)
    // 如果找到匹配的 ID，則返回它，否則返回 null
    return match ? match[1] : 'null'
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="總覽" {...a11yProps(0)} />
          <Tab label="教材" {...a11yProps(1)} />
          <Tab label="學習紀錄" {...a11yProps(2)} />
          <Tab label="作答紀錄" {...a11yProps(3)} />
          <Tab
            label="目錄"
            {...a11yProps(4)}
            sx={{ display: { md: 'none' } }}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {videoData && (
          <ul>
            <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>
              {videoData?.title}
            </Typography>
            <Typography
              variant="body1"
              paragraph={true}
              style={{ textIndent: '2em' }}
            >
              {videoData?.description}
            </Typography>
          </ul>
        )}
      </TabPanel>

      {/* PDF Path 還需要修正 */}
      <TabPanel value={value} index={1}>
        {videoData &&
          (videoData.material ? (
            <div>
              {/* <Button
                sx={{ height: '40px', width: 'auto' }}
                onClick={() => {
                  window.open(videoData.material ?? '')
                }}
              >
                <OpenInNew /> <Typography sx={{ mx: 1 }}>新分頁</Typography>
              </Button>
              <Button
                sx={{ height: '40px', width: 'auto' }}
                onClick={() => {
                  document.getElementById('course-pdf-download-path')?.click()
                }}
              >
                <FileDownload /> <Typography sx={{ mx: 1 }}>下載</Typography>
              </Button>
              <a
                id="course-pdf-download-path"
                href={videoData.material ?? ''}
                download
                style={{ display: 'none' }}
              >
                下載
              </a> */}
              <div style={{ height: '600px' }}>
                <iframe
                  style={{ width: '100%', height: '100%' }}
                  src={`https://drive.google.com/file/d/${extractGoogleDriveId(
                    videoData.material ?? ''
                  )}/preview`}
                ></iframe>
              </div>
              {/* <PDF path={videoData.material ?? ''}></PDF> */}
            </div>
          ) : (
            <h3>沒有教材</h3>
          ))}
      </TabPanel>

      <TabPanel value={value} index={2}>
        <EyesTracking />
      </TabPanel>

      <TabPanel value={value} index={3}>
        {videoData && <ReplyLog questions={videoData.questions}></ReplyLog>}
      </TabPanel>

      {/* 已知BUG 左側和下方tab的目錄不會同步 */}
      {/* 視窗拉大 tab 頁面還是目錄 */}
      <TabPanel value={value} index={4}>
        <CustomizedAccordions
          chapterData={chapterData}
          pastViewData={pastViewData}
          courseId={courseId}
        ></CustomizedAccordions>
      </TabPanel>
    </Box>
  )
}

function getWindowSize() {
  const { innerWidth, innerHeight } = window
  return { innerWidth, innerHeight }
}
