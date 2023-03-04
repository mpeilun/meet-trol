import { Box, Card, Divider, Icon, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { GetServerSideProps, GetStaticPropsContext } from 'next'

// import CoursePlayer from '../../components/courses/course-player'
// import CourseTab from '../../components/courses/course-tab'

import CustomizedAccordions from '../../components/chapter/chapter'
import dynamic from 'next/dynamic'
import * as React from 'react'
import {
  Chapter,
  Video,
  LastView,
  Info,
  Choice,
  ChoiceFeedback,
  Rank,
  RankFeedback,
  Fill,
  FillFeedback,
  Drag,
  DragFeedback,
} from '@prisma/client'
import { ChapterListData } from '../../types/chapter'

// const CoursePlayer = dynamic(
//   () => import('../../components/courses/course-player')
import CoursePlayer from '../../components/courses/course-player'
const CourseTab = dynamic(() => import('../../components/courses/course-tab'), {
  ssr: false,
})

function CourseInnerPage(props: { chapter: ChapterListData[] }) {
  const data = props.chapter
  console.log('fetch chapter data')
  console.log(data)
  const [chapter, setChapter] = React.useState<ChapterListData[]>(data)
  if (chapter == undefined) {
    console.log('ID not found')
    console.log(chapter)

    return (
      <>
        <p>Page not found. Check the course ID, please.</p>
      </>
    )
  } else {
    console.log('load course')
    console.log(chapter)
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
            <CustomizedAccordions chapterData={chapter}></CustomizedAccordions>
            <Divider />
          </Card>
        </Box>
        <Box
          className="course-material-div"
          width="100%"
          overflow="scroll"
          sx={{ overflowX: 'hidden' }}
        >
          <CoursePlayer></CoursePlayer>
          <CourseTab
            id={''}
            url={''}
            title={''}
            description={''}
            material={''}
            chapterId={''}
          ></CourseTab>
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
    //true(沒有pre-render時，render, 此時還沒有資料, 需要有fallback) false blocking
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const courseId = context.params?.id as string
  const chapterResponse = await fetch(
    `http://localhost:3000/api/chapter/${courseId}`
  )

  // const lastViewResponse = await fetch(
  //   `http://localhost:3000/api/record/${courseId}`
  // )
  // const record = await lastViewResponse.json()
  // const lastView: LastViewData[] = record[0].lastView

  if (chapterResponse.status === 200) {
    const chapter: Array<ChapterListData> = await chapterResponse.json()
    // const record = await lastViewResponse.json()
    // const lastView: LastViewData[] = record[0].lastView
    return { props: { chapter } }
  } else {
    return { props: { chapter: null } }
  }
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getServerSession(context.req, context.res, authOptions)
//   const courseId = context.params?.id as string
//   if (!session) {
//     return {
//       props: { record: null },
//     }
//   }

//   const lastViewResponse = await fetch(
//     `http://localhost:3000/api/record/${courseId}`
//   )

//   if (lastViewResponse.status === 200) {
//     const record = await lastViewResponse.json()
//     const lastView: LastViewData[] = record[0].lastView
//     return { props: { record } }
//   } else {
//     return { props: { record: null } }
//   }
// }

export default CourseInnerPage
