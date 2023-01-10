import { useRouter } from 'next/router'

import CourseList from '../../components/courses/course-list'
import { getAllCourses } from '../../lib/dummy-data'
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { grey } from '@mui/material/colors'

function AllCoursesPage() {
  return (
    <>
      <Grid container flexDirection="row-reverse" justifyContent="space-between" spacing={2} width={'80%'} height={'100%'} maxWidth={'xl'} m={'5rem auto'} p={'2rem'} sx={{ backgroundColor: '#fff' }}>
        <Grid md={12} xs={12} display="flex" justifyContent="center" alignContent="center" m={2}>
          <TextField sx={{ width: '50%', minWidth: '100px' }}></TextField>
          {/*TODO 考慮使用ICON Button */}
          <Button variant="contained" sx={{ ml: '5%' }}>
            <Typography>加入課程</Typography>
          </Button>
        </Grid>
        <Grid md={12} xs={12}>
          <Box display="flex" flexDirection="column" m={2}>
            <Typography variant="h5">我的課程</Typography>
            {(function () {
              let elements = []
              for (let i = 0; i < 10; i++) {
                elements.push(<Box key={i} mt={1} width={'100%'} height={'8rem'} bgcolor={'#000'}></Box>)
              }
              return elements
            })()}
          </Box>
        </Grid>
      </Grid>
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
