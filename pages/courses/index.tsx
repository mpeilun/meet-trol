import { useRouter } from 'next/router'

import CourseList from '../../components/courses/course-list'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  TextField,
  Paper,
} from '@mui/material'

import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { grey } from '@mui/material/colors'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Link from 'next/link'
import * as React from 'react'
import { Course } from '@prisma/client'

function AllCoursesPage() {
  const [courseData, setCourseData] = React.useState<Course[]>([])
  const [courseID, setCourseId] = React.useState('')

  const fetchData = React.useCallback(async () => {
    const response = await fetch(`/api/course?myCourse=true`)
    const data: Course[] = await response.json()
    setCourseData(data)
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [])

  return (
    <Paper
      key={'paper'}
      sx={{
        width: { md: '80%', xs: ' 100%' },
        height: '100%',
        maxWidth: 'xl',
        m: { md: '1rem auto', xs: '0' },
        p: '2rem',
        backgroundColor: '#F9F5E3',
      }}
    >
      <Grid
        container
        flexDirection="row-reverse"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid
          md={12}
          xs={12}
          display="flex"
          justifyContent="center"
          alignContent="center"
          m={2}
        >
          <TextField
            value={courseID}
            placeholder="加入課程  請輸入課程ID"
            sx={{ width: '50%', minWidth: '100px', bgcolor: '#FFF' }}
            onChange={(e) => setCourseId(e.target.value)}
          ></TextField>
          {/*TODO 考慮使用ICON Button */}
          <Button
            variant="contained"
            sx={{ ml: '1rem', height: '95%' }}
            onClick={async () => {
              await fetch(`/api/course/joint/${courseID}`)
              await fetchData()
            }}
          >
            <ArrowForwardIcon />
          </Button>
          <Link href="/manage/courses">
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="contained"
              sx={{ ml: '1rem', height: '95%', fontSize: '20' }}
            >
              新增課程
            </Button>
          </Link>
        </Grid>
        <Grid md={12} xs={12}>
          <Typography
            variant="h4"
            m={'0 auto'}
            fontWeight="bold"
            sx={{ ml: 15 }}
          >
            我的課程
          </Typography>
          <Box display="flex" flex={'center'} flexDirection="column" m={2}>
            <Grid
              container
              spacing={2}
              mt={2}
              justifyContent={{ md: 'center', xs: 'center' }}
            >
              {courseData.map(({ id, title, description }, index) => {
                return (
                  <Grid md={4} key={`courseItem-${index}`}>
                    {/* <img
                      style={{ margin: 'auto' }}
                      src="https://i.imgur.com/uCSOvTI.png"
                      width={180}
                      height={180}
                    ></img> */}
                    <Box m={'auto'} width={'100%'} maxWidth="200ps">
                      <Link href={`/courses/${id}`}>
                        <Typography textAlign={'center'} bgcolor={grey[400]}>
                          {title}
                        </Typography>
                      </Link>
                    </Box>
                    <Typography textAlign={'center'} sx={{ color: grey }}>
                      {description}
                    </Typography>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default AllCoursesPage

// function AllCoursesPage() {
//   const router = useRouter()
//   const AllCourses = getAllCourses()

//   return <CourseList items={AllCourses} />
// }

// export default AllCoursesPage
