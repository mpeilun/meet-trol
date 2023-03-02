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
        <Box sx={{ p: 3 }}>
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

export default function CourseTabs(props: Video) {
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const materal = props.material as unknown as { url: string }

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
          <Tab
            label="目錄"
            {...a11yProps(3)}
            sx={{ display: { md: 'none' } }}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ul>
          <li>{props.title}</li>
          <li>{props.description}</li>
          <li>{props.description}</li>
          <li>{props.description}</li>
          <li>{props.description}</li>
          <li>{props.description}</li>
          <li>{props.description}</li>
        </ul>
      </TabPanel>

      <TabPanel value={value} index={1}>
        {props.material && (
          <>
            <Button
              sx={{ height: '40px', width: 'auto' }}
              onClick={() => {
                window.open(materal.url)
              }}
            >
              <OpenInNew /> <Typography sx={{ mx: 1 }}>新分頁</Typography>
            </Button>
            <Button
              sx={{ height: '40px', width: 'auto' }}
              onClick={() => {
                document.getElementById('course-pdf-downlaod-path')?.click()
              }}
            >
              <FileDownload /> <Typography sx={{ mx: 1 }}>下載</Typography>
            </Button>
            <a
              id="course-pdf-downlaod-path"
              href={props.material}
              download
              style={{ display: 'none' }}
            >
              下載
            </a>
            <PDF path={props.material}></PDF>
          </>
        )}
      </TabPanel>

      <TabPanel value={value} index={2}>
        <EyesTracking />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Box p={3} display="flex" justifyContent="space-between">
          <Typography sx={{ fontWeight: 'bold' }}>章節1</Typography>
          <Icon>
            <KeyboardArrowDown />
          </Icon>
        </Box>
        <Divider />
        <Box p={3} display="flex" justifyContent="space-between">
          <Typography sx={{ fontWeight: 'bold' }}>章節2</Typography>
          <Icon>
            <KeyboardArrowDown />
          </Icon>
        </Box>
        <Divider />
        <Box p={3} display="flex" justifyContent="space-between">
          <Typography sx={{ fontWeight: 'bold' }}>章節3</Typography>
          <Icon>
            <KeyboardArrowDown />
          </Icon>
        </Box>
        <Divider />
      </TabPanel>
    </Box>
  )
}

function getWindowSize() {
  const { innerWidth, innerHeight } = window
  return { innerWidth, innerHeight }
}
