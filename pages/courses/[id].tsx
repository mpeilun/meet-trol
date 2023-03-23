import { Box, Card, Divider, Icon, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import CustomizedAccordions from '../../components/chapter/chapter'
import dynamic from 'next/dynamic'
import * as React from 'react'
import { parse } from 'cookie'

import { ChapterListData, LastViewData } from '../../types/chapter'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const CoursePlayer = dynamic(
  () => import('../../components/courses/course-player')
)
const CourseTab = dynamic(() => import('../../components/courses/course-tab'))
// import CoursePlayer from '../../components/courses/course-player'
// import CourseTab from '../../components/courses/course-tab'

function CourseInnerPage(props: {
  chapter: ChapterListData[]
  error: boolean
  record: { lastView: LastViewData[] }[]
}) {
  const router = useRouter()
  const pid = router.query.id as string
  const data = props.chapter

  const [chapter, setChapter] = React.useState<ChapterListData[]>(data)
  if (
    chapter == undefined ||
    chapter.length < 1 ||
    props.error == true ||
    props.record == undefined ||
    props.record.length < 1
  ) {
    return (
      <>
        <p>
          Page not found. Please Checking the course ID or confirming you are
          logged.
        </p>
      </>
    )
  } else {
    const lastView: LastViewData[] = props.record[0].lastView

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
              chapterData={chapter}
              lastView={lastView}
            ></CustomizedAccordions>
            <Divider />
          </Card>
        </Box>
        <Box
          className="course-material-div"
          width="100%"
          overflow="scroll"
          sx={{ overflowX: 'hidden' }}
        >
          <CoursePlayer courseId={pid}></CoursePlayer>
          <CourseTab chapterData={chapter} lastView={lastView}></CourseTab>
        </Box>
      </Box>
    )
  }
}

// export const getStaticProps = async (context: GetStaticPropsContext) => {
//   const lastViewResponse = await fetch(
//     `http://localhost:3000/api/record/${courseId}`
//   )
//   const record = await lastViewResponse.json()
//   const lastView: LastViewData[] = record[0].lastView
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  const courseId = context.params?.id as string

  // Retrieve the value of a cookie
  if (session) {
    const chapterResponse = await fetch(
      `http://localhost:3000/api/chapter/${courseId}`
    )
    const lastViewResponse = await fetch(
      `http://localhost:3000/api/record/${courseId}`,
      {
        method: 'GET',
        headers: {
          Cookie: context.req.headers.cookie,
        },
      }
    )
    if (chapterResponse.status === 200 && lastViewResponse.status === 200) {
      const chapter: Array<ChapterListData> = await chapterResponse.json()
      const record: Array<LastViewData> = await lastViewResponse.json()

      return { props: { chapter, error: false, record } }
    } else {
      return {
        props: { chapter: null, error: true, record: null },
      }
    }
  } else {
    return {
      props: { chapter: null, error: true, record: null },
    }
  }
}

export default CourseInnerPage
