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

function CoursesManagePage() {
  const { data: session } = useSession()
  const [jointCourseLoading, setJointCourseLoading] = React.useState(false)
  const [courseData, setCourseData] = React.useState<Course[]>([])
  const [courseID, setCourseId] = React.useState('')
  const dispatch = useAppDispatch()

  const fetchData = React.useCallback(async () => {
    const response = await fetch(`/api/course?owner=true`)
    const data: Course[] = await response.json()
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
        flexDirection="row-reverse"
        justifyContent="space-between"
        spacing={2}
      >
        {/* <Grid
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
                  sendMessage({ severity: 'success', message: '成功加入課程' })
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
        </Grid> */}
        <Grid md={12} xs={12}>
          <Typography
            display={'flex'}
            variant="h4"
            fontWeight="bold"
            justifyContent={'center'}
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
              <Grid md={4}>
                <Link href="/manage/courses">
                  <Card component={'a'}>
                    <Box
                      width={'150px'}
                      height={'150px'}
                      bgcolor={'secondary.main'}
                      sx={{
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
              {courseData.map(({ id, title, description }, index) => {
                return (
                  <Grid md={4} key={`courseItem-${index}`}>
                    {/* <img
                      style={{ margin: 'auto' }}
                      src="https://i.imgur.com/uCSOvTI.png"
                      width={180}
                      height={180}
                    ></img> */}
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      justifyContent={'center'}
                    >
                      <Link href={`/manage/${id}`} passHref legacyBehavior>
                        <Typography
                          component="a"
                          bgcolor={grey[400]}
                          textAlign={'center'}
                          sx={{
                            color: 'inherit',
                            // textDecoration: 'none'
                          }}
                        >
                          {title}
                        </Typography>
                      </Link>
                      <Typography textAlign={'center'} sx={{ color: grey }}>
                        {description}
                      </Typography>
                    </Box>
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

export default CoursesManagePage
