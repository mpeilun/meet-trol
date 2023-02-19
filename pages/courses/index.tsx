import { useRouter } from 'next/router'

import CourseList from '../../components/courses/course-list'
import { getAllCourses } from '../../lib/dummy-data'
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, TextField, Paper } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { grey } from '@mui/material/colors'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Link from 'next/link'

function AllCoursesPage() {
  return (
    <Paper sx={{ width: { md: '80%', xs: ' 100%' }, height: '100%', maxWidth: 'xl', m: { md: '5rem auto', xs: '0' }, p: '2rem', backgroundColor: '#FFF' }}>
      <Grid container flexDirection="row-reverse" justifyContent="space-between" spacing={2}>
        <Grid md={12} xs={12} display="flex" justifyContent="center" alignContent="center" m={2}>
          <TextField placeholder="加入課程" sx={{ width: '50%', minWidth: '100px' }}></TextField>
          {/*TODO 考慮使用ICON Button */}
          <Button variant="contained" sx={{ ml: '1rem', height: '95%' }}>
            <ArrowForwardIcon />
          </Button>
        </Grid>
        <Grid md={12} xs={12}>
          <Box display="flex" flexDirection="column" m={2}>
            <Typography variant="h5" m={'0 auto'}>
              我的課程
            </Typography>
            <Grid container spacing={1} mt={1} justifyContent={{ md: 'center', xs: 'center' }}>
              {(function () {
                let elements = []
                for (let i = 0; i < 10; i++) {
                  elements.push(
                    <Grid md={4} xs={12} key={i}>
                      <Box m={'auto'} width={'100%'} maxWidth="200px" height={'200px'}>
                        <Link href={'/courses/e1'}>
                          <Typography textAlign={'center'} bgcolor={grey[400]}>
                            Android TQC+
                          </Typography>
                        </Link>
                      </Box>
                    </Grid>
                  )
                }
                return elements
              })()}
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
