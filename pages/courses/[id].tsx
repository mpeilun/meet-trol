import { Box, Card, Divider, Icon, Typography } from '@mui/material'
import { useRouter } from 'next/router'

// import CoursePlayer from '../../components/courses/course-player'
// import CourseTab from '../../components/courses/course-tab'

import { CourseDataType, getCourseById } from '../../lib/dummy-data'
import CustomizedAccordions from '../../components/chapter/chapter'
import dynamic from 'next/dynamic'
import * as React from 'react'
import { Chapter } from '@prisma/client'

const CoursePlayer = dynamic(
  () => import('../../components/courses/course-player'),
  { ssr: false }
)
const CourseTab = dynamic(() => import('../../components/courses/course-tab'), {
  ssr: false,
})

function CourseInnerPage() {
  const router = useRouter()
  const courseId = router.query.id
  let course: CourseDataType | undefined
  const [chapterData, setChapterData] = React.useState<Array<Chapter>>([])
  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/chapter`)
      const json: Array<Chapter> = await response.json()
      setChapterData(json)
      console.log(json[0].id)
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

  return {
    paths: [
      { params: { id: 'e1' } },
      { params: { id: 'e2' } },
      { params: { id: 'e3' } },
      { params: { id: 'e4' } },
    ],
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
