import {
  Box,
  CardActionArea,
  Typography,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Paper,
} from '@mui/material'

import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { grey } from '@mui/material/colors'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Link from 'next/link'
import * as React from 'react'
import { sendMessage } from '../../store/notification'
import { useAppDispatch } from '../../hooks/redux'
import { LoadingButton } from '@mui/lab'
import CourseCard from '../../components/courses/course-card'
import { CourseWithOwner } from '../../types/course'
import BodyLayout from '../../components/layout/common-body'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

const fetcher = async (url: string) => {
  return await fetch(url).then((res) => {
    if (!res.ok) {
      return 'error'
    }
    return res.json()
  })
}

function AllCoursesPage() {
  const { data: session } = useSession()
  const [jointCourseLoading, setJointCourseLoading] = React.useState(false)
  const [courseData, setCourseData] = React.useState<CourseWithOwner[]>([])
  const [courseID, setCourseId] = React.useState('')
  const dispatch = useAppDispatch()

  const fetchData = React.useCallback(async () => {
    const response = await fetch(`/api/course?myCourse=true`)
    const data: CourseWithOwner[] = await response.json()
    if (response.status == 200) {
      setCourseData(data)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [])

  if (!session)
    return (
      <BodyLayout>
        <Typography variant="h3" textAlign={'center'} sx={{ color: 'grey' }}>
          請登入以查看課程
        </Typography>
      </BodyLayout>
    )
  return (
    <BodyLayout>
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
            placeholder="請輸入課程ID"
            sx={{ width: '50%', minWidth: '100px' }}
            onChange={(e) => setCourseId(e.target.value)}
          ></TextField>
          <LoadingButton
            startIcon={<ArrowForwardIcon />}
            loading={jointCourseLoading}
            variant="contained"
            sx={{ ml: '1rem', height: '95%' }}
            onClick={async () => {
              setJointCourseLoading(true)
              const result = await fetch(`/api/course/joint/${courseID}`)
              if (result.status === 201) {
                dispatch(
                  sendMessage({
                    severity: 'success',
                    message: '成功加入課程',
                  })
                )
                await fetchData()
              } else if (result.status === 409) {
                dispatch(
                  sendMessage({
                    severity: 'warning',
                    message: (await result.json()).message,
                  })
                )
              } else {
                dispatch(
                  sendMessage({ severity: 'error', message: '課程不存在' })
                )
              }
              setJointCourseLoading(false)
            }}
          >
            加入課程
          </LoadingButton>
        </Grid>
        <Grid md={12} xs={12}>
          <Typography
            display={'flex'}
            variant="h4"
            fontWeight="bold"
            justifyContent={'center'}
          >
            我的課程
          </Typography>
          <Box display="flex" flex={'center'} flexDirection="column" m={2}>
            <Grid
              container
              spacing={3}
              maxWidth="lg"
              m={1}
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
                            isManage={false}
                          />
                        }
                      </Grid>
                    )
                  }
                )
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </BodyLayout>
  )
}

export default AllCoursesPage
