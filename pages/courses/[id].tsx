import { Box, Card, Divider, Icon, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPropsContext } from 'next'

// import CoursePlayer from '../../components/courses/course-player'
// import CourseTab from '../../components/courses/course-tab'

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

interface ChapterData extends Chapter {
  videos: Video[]
}

function CourseInnerPage(props: { chapter: ChapterData[] }) {
  const data = props.chapter
  const [chapterData, setChapterData] = React.useState<ChapterData[]>(data)

  console.log(data)
  if (chapterData == undefined) {
    console.log('ID not found')
    return (
      <>
        <p>Page not found. Check the course ID, please.</p>
      </>
    )
  } else {
    console.log(chapterData)
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
            <CustomizedAccordions chapterData={data}></CustomizedAccordions>
            <Divider />
          </Card>
        </Box>
        <Box className="course-material-div" flexGrow={1} overflow="scroll">
          <CoursePlayer></CoursePlayer>
          {/* <CourseTab course={videoData}></CourseTab> */}
        </Box>
      </Box>
    )
  }
}

export async function getStaticPaths() {
  const response = await fetch(`http://localhost:3000/api/course/getId`)
  const json: Array<Chapter> = await response.json()

  const paths = json.map((item) => ({
    params: { id: item.id },
  }))
  return {
    paths,
    fallback: true,
    //true(找無pre-render時，render, 此時還沒有資料, 需要有fallback) false blocking
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  console.log('fetch chapter data')

  // courseId 如果找不到會壞掉
  // 目前判斷24字元才fetch
  // 未判斷是否ObjectId
  const courseId = context.params?.id as string
  const chapterResponse = await fetch(
    `http://localhost:3000/api/chapter/${courseId}`
  )
  if (chapterResponse.status === 200) {
    const chapter: Array<ChapterData> = await chapterResponse.json()
    return { props: { chapter } }
  } else {
    return { props: { chapter: null } }
  }
}

export default CourseInnerPage
