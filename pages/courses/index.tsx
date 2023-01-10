import { useRouter } from 'next/router'

import CourseList from '../../components/courses/course-list'
import { getAllCourses } from '../../lib/dummy-data'
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material'
import { grey } from '@mui/material/colors'

function AllCoursesPage() {
  return (
    <>
      <Box display="flex" flexDirection="row-reverse" width={'80%'} height={'100%'} maxWidth={'xl'} m={'4rem auto'} sx={{ backgroundColor: '#fff' }}>
        <Box>加入課程</Box>
        <Box display="flex" flexDirection="column" p={10}>
          <Typography variant="h5">我的課程</Typography>
          <Box width={'500px'} height={'250px'} bgcolor={'#000'}>
            {' '}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AllCoursesPage

// function AllCoursesPage() {
//   const router = useRouter()
//   const AllCourses = getAllCourses()

//   return <CourseList items={AllCourses} />
// }

// export default AllCoursesPage
