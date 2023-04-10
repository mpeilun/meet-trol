import {
  Box,
  Card,
  CircularProgress,
  Divider,
  Icon,
  Typography,
} from '@mui/material'
import dynamic from 'next/dynamic'
import * as React from 'react'
import { ChapterListData, PastViewData } from '../../types/chapter'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Shimmer } from 'react-shimmer'
import InfoCard from '../../components/infoCard'

// import CoursePlayer from '../../components/courses/course-player'
// import CourseTab from '../../components/courses/course-tab'

const CoursePlayer = dynamic(
  () => import('../../components/courses/course-player'),
  {
    loading: () => (
      <Box
        sx={{
          width: '100%',
          height: '85%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    ),
    ssr: false,
  }
)
const CourseTab = dynamic(() => import('../../components/courses/course-tab'), {
  ssr: false,
})
const CustomizedAccordions = dynamic(
  () => import('../../components/chapter/chapter'),
  {
    ssr: false,
  }
)
const fetcher = async (url: string) => {
  return await fetch(url).then((res) => {
    if (!res.ok) {
      return 'error'
    }
    return res.json()
  })
}

function CourseInnerPage(props: {}) {
  const router = useRouter()
  const courseId = router.query.id as string

  const { data: chapterData, error: chapterError } = useSWR(
    courseId && ['http://localhost:3000/api/chapter?courseId=' + courseId],
    fetcher
  )
  const { data: pastViewData, error: recordError } = useSWR(
    courseId && ['http://localhost:3000/api/record?courseId=' + courseId],
    fetcher
  )
  const isLoading =
    !chapterData && !chapterError && !pastViewData && !recordError

  if (isLoading || !courseId) {
    return <></>
  } else if (chapterData === 'error' || pastViewData === 'error') {
    return (
      <InfoCard
        title="Error"
        message="Read failed. Please confirm the course code or whether you have enrolled
      in this course, or if you have already logged in."
      ></InfoCard>
    )
  } else if (chapterData && pastViewData) {
    // return <p>test</p>
    return (
      <Box
        className="course-main-div"
        display="flex"
        width="100%"
        height={'100%'}
        maxHeight={'calc(100vh - 68.5px)'}
      >
        <Box
          className="course-nav-div"
          display={{ width: '20vw', xs: 'none', md: 'flex' }}
        >
          <Card
            elevation={0}
            sx={{
              height: '100%',
              width: '100%',
              borderRadius: 0,
              overflowY: 'auto',
            }}
          >
            <CustomizedAccordions
              chapterData={chapterData as ChapterListData[]}
              pastViewData={pastViewData as PastViewData[]}
              courseId={courseId}
            ></CustomizedAccordions>
            <Divider />
          </Card>
        </Box>
        <Box
          id="course-material-div"
          className="course-material-div"
          width="100%"
          overflow="scroll"
          sx={{ overflowX: 'hidden' }}
        >
          <CoursePlayer courseId={courseId}></CoursePlayer>
          <CourseTab
            chapterData={chapterData}
            courseId={courseId}
            pastViewData={pastViewData}
          ></CourseTab>
        </Box>
      </Box>
    )
  }
}

export default CourseInnerPage
