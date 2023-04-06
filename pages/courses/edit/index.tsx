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
  Fab,
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
import BodyLayout from '../../../components/layout/common-body'
import AddIcon from '@mui/icons-material/Add'

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
    <BodyLayout>
      <Typography
        display={'flex'}
        variant="h4"
        fontWeight="bold"
        justifyContent={'center'}
        alignItems={'center'}
      >
        您所管理的課程
      </Typography>
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
      <Link
        href="/courses/edit/course"
        style={{ display: 'flex', justifyContent: 'end' }}
      >
        <Fab component={'a'} color="primary" sx={{ boxShadow: '2' }}>
          <AddIcon />
        </Fab>
      </Link>
    </BodyLayout>
  )
}

export default CoursesManagePage
