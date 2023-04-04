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
  Card,
  CardActions,
} from '@mui/material'
import CourseCard from '../../../components/courses/course-card'

import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { grey } from '@mui/material/colors'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Link from 'next/link'
import * as React from 'react'
import { Course } from '@prisma/client'
import { sendMessage } from '../../../store/notification'
import { useAppDispatch } from '../../../hooks/redux'
import { LoadingButton } from '@mui/lab'
import { useSession } from 'next-auth/react'
import { CourseWithOwner } from '../../../types/course'

function CoursesManagePage() {
  const { data: session } = useSession()
  const [jointCourseLoading, setJointCourseLoading] = React.useState(false)
  const [courseData, setCourseData] = React.useState<CourseWithOwner[]>([])
  const [courseID, setCourseId] = React.useState('')
  const dispatch = useAppDispatch()

  const fetchData = React.useCallback(async () => {
    const response = await fetch(`/api/course?owner=true`)
    const data: CourseWithOwner[] = await response.json()
    setCourseData(data)
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [])

  if (!session)
    return (
      <Box>
        <Typography variant="h2" sx={{ mt: '20%' }} fontWeight="bold">
          請先登入
        </Typography>
      </Box>
    )
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
        flexDirection="row"
        justifyContent="space-between"
        spacing={2}
        xs={12}
        sm={12}
        md={12}
        lg={12}
      >
        <Grid xs={12} sm={8} md={8} lg={8}>
          <Typography
            display={'flex'}
            variant="h4"
            fontWeight="bold"
            justifyContent={'center'}
            alignItems={'center'}
          >
            您所管理的課程
          </Typography>
        </Grid>
        <Grid xs={12} sm={4} md={4} lg={4}>
          <Link href="/manage/courses">
            <Card component={'a'}>
              <Box
                width={'150px'}
                height={'80px'}
                bgcolor={'secondary.main'}
                sx={{
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="h5"
                  textAlign={'center'}
                  color={'white'}
                  //TODO need overwrite underline none
                  sx={{ textDecorationLine: 'none !important' }}
                >
                  新增課程
                </Typography>
              </Box>
            </Card>
          </Link>
        </Grid>
      </Grid>
      <Box display="flex" flex={'center'} flexDirection="column" m={2}>
        <Grid
          container
          spacing={2}
          mt={2}
          justifyContent={{ md: 'center', xs: 'center' }}
        >
          {courseData.length == 0 ? (
            <Typography variant="h3" sx={{ color: 'grey' }}>
              目前尚未加入任何課程
            </Typography>
          ) : (
            courseData.map(
              ({ id, title, description, start, end, owners }, index) => {
                return (
                  <Grid
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={`courseItem-${index}`}
                  >
                    {
                      <CourseCard
                        id={id}
                        title={title}
                        description={description}
                        start={start}
                        end={end}
                        owner={owners}
                        isManage={true}
                      />
                    }
                  </Grid>
                )
              }
            )
          )}
        </Grid>
      </Box>
    </Paper>
  )
}

export default CoursesManagePage
