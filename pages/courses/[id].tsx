import { Box, Card, Divider, Icon, Typography } from '@mui/material'
import { useRouter } from 'next/router'
// import CoursePlayer from '../../components/courses/course-player'
import dynamic from 'next/dynamic';
const CoursePlayer = dynamic(() => import('../../components/courses/course-player'), { ssr: false });
const CourseTab = dynamic(() => import('../../components/courses/course-tab'), { ssr: false });
// import CourseTab from '../../components/courses/course-tab'
import { CourseDataType, getCourseById } from '../../lib/dummy-data'
import { ArrowDownward, ArrowDropDown, KeyboardArrowDown } from '@mui/icons-material'

function CourseInnerPage() {
  const router = useRouter()
  const courseId = router.query.id

  let course: CourseDataType | undefined
  if (typeof courseId === 'string') {
    course = getCourseById(courseId)
  }
  if (!course) {
    return <p>Not Course Found!</p>
  }

  return (
    <Box className='course-main-div' display='flex' width='100%' height={'100vh'} maxHeight={'calc(100vh - 68.5px)'}>
      <Box className='course-material-div' flexGrow={1} overflow='scroll'>
        <CoursePlayer></CoursePlayer>
        <CourseTab course={course}></CourseTab>
      </Box>
      <Box className='course-nav-div'  display={{ width: '20vw', xs: 'none', md: 'flex' }}>
        <Card sx={{ width: '100%' }}>
          <Box p={3} display='flex' justifyContent='space-between'>
            <Typography sx={{ fontWeight: 'bold' }}>章節1</Typography>
            <Icon><KeyboardArrowDown /></Icon>
          </Box>
          <Divider />
          <Box p={3} display='flex' justifyContent='space-between'>
            <Typography sx={{ fontWeight: 'bold' }}>章節2</Typography>
            <Icon><KeyboardArrowDown /></Icon>
          </Box>
          <Divider />
          <Box p={3} display='flex' justifyContent='space-between'>
            <Typography sx={{ fontWeight: 'bold' }}>章節3</Typography>
            <Icon><KeyboardArrowDown /></Icon>
          </Box>
          <Divider />
        </Card>
      </Box>

    </Box>
  )
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: 'e1' } }, { params: { id: 'e2' } }, { params: { id: 'e3' } }, { params: { id: 'e4' } }],
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