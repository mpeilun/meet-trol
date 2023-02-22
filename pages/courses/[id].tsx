import { Box, Card, Divider, Icon, Typography } from '@mui/material'
import { useRouter } from 'next/router'

// import CoursePlayer from '../../components/courses/course-player'
// import CourseTab from '../../components/courses/course-tab'

import { CourseDataType, getCourseById } from '../../lib/dummy-data'
import CustomizedAccordions from '../../components/chapter/chapter'
import dynamic from 'next/dynamic'
import * as React from 'react'
import { Chapter, Video } from '@prisma/client'

const CoursePlayer = dynamic(
  () => import('../../components/courses/course-player'),
  { ssr: false }
)
const CourseTab = dynamic(() => import('../../components/courses/course-tab'), {
  ssr: false,
})

function CourseInnerPage() {
  const router = useRouter()
  const query = router.query as { id: string }
  const courseId = query.id

  let course: CourseDataType | undefined
  const [chapterData, setChapterData] = React.useState<Array<Chapter>>([])
  const [videoData, setVideoData] = React.useState<Array<Video>>([])

  React.useEffect(() => {
    async function fetchData() {
      const chapterResponse = await fetch(`/api/chapter`)
      const chapterJson: Array<Chapter> = await chapterResponse.json()
      setChapterData(chapterJson)
      const index = chapterJson.findIndex(item => item.classesId === courseId)
      // console.log(chapterJson.findIndex(item => item.classesId === courseId))

      const videoResponse = await fetch(`/api/video/${chapterJson[index].id}`)
      const videoJson: Array<Video> = await videoResponse.json()
      setVideoData(videoJson)
      console.log(videoJson)
    }
    fetchData()
  }, [])

  if (typeof courseId === 'string') {
    course = getCourseById(courseId)
  }

  if (!course) {
    return <p>Not Course Found!</p>
  }

  return (
    <Box
      className="course-main-div"
      display="flex"
      width="100%"
      height={'100vh'}
      maxHeight={'calc(100vh - 68.5px)'}
    >
      <Box
        className="course-nav-div"
        display={{ width: '20vw', xs: 'none', md: 'flex' }}
      >
        <Card sx={{ width: '100%' }}>
          <CustomizedAccordions></CustomizedAccordions>
          <Divider />
        </Card>
      </Box>
      <Box className="course-material-div" flexGrow={1} overflow="scroll">
        <CoursePlayer></CoursePlayer>
        <CourseTab course={course}></CourseTab>
      </Box>
    </Box>
  )
}

export async function getStaticPaths() {
  const response = await fetch(`http://localhost:3000/api/chapter`)
  const json: Array<Chapter> = await response.json()

  const paths = json.map((item) => ({
    params: { id: item.classesId },
  }))
  return {
    paths,
    fallback: true,
    //true(找無pre-render時，render, 此時還沒有資料, 需要有fallback) false blocking
  }
}

export async function getStaticProps(content: any) {
  console.log(content.params)
  return {
    props: {
      items: '',
    },
  }
}

export default CourseInnerPage
