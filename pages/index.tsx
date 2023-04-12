// import Link from 'next/link'
// import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material'
// import { CourseDataType, getAllCourses } from '../lib/dummy-data'
import CourseList from '../components/courses/course-list'
import { useContext } from 'react'
import Image from 'next/image'
import {
  Box,
  Button,
  ButtonBase,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

function HomePage() {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <>
      <Container
        sx={{
          justifyContent: 'center',
          display: 'flex',
          height: '100%',
          maxWidth: 'md',
        }}
      >
        <Grid
          container
          justifyContent="center"
          sx={{ maxWidth: 'md', display: 'flex', height: '100%' }}
        >
          <Grid item xs={12} sm={6} md={6}>
            <Grid
              container
              justifyContent={{ xs: 'center', sm: 'center' }}
              alignItems="center"
              direction="column"
              height="100%"
            >
              
              <Image
                width={300}
                height={200}
                style={{
                  objectFit: 'contain',
                }}
                alt={'Meet-Trol LOGO'}
                src={'/images/logo.png'}
              />
              <Image
                priority
                src="/logo-font.svg"
                width={300}
                height={100}
                alt="logo-font"
              />
              {/* <Typography variant="h2" fontWeight={400}>
        Meet-Trol
      </Typography> */}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Grid
              container
              justifyContent={{ xs: 'start', sm: 'center' }}
              alignItems="center"
              direction="column"
              height="100%"
            >
              <Box width={{ xs: '300px', sm: '90%' }}>
                <Typography sx={{ textAlign: 'justify' }}>
                  線上影片學習系統，透過互動問題與眼球追蹤技術，
                  分析學生對課程內容的理解程度，使教育者能夠調整教學內容，提升學習的效率。
                </Typography>
              </Box>
              <Box>
                <Button
                  disableElevation
                  variant="contained"
                  size="large"
                  onClick={() => {
                    {
                      session
                        ? window.open('/courses')
                        : window.open('/auth/signin')
                    }
                  }}
                  sx={{
                    marginTop: '32px',
                    borderRadius: '8px',
                  }}
                >
                  <Typography>{session ? '開始上課' : '登入體驗'}</Typography>
                </Button>
                <Button 
                  disableElevation
                  variant="contained"
                  size="large"
                  sx={{
                    ml:'5px',
                    marginTop: '32px',
                    borderRadius: '8px',
                  }}
                  onClick={() => window.location.href = 'https://youtu.be/qJ2l6mRnPP0'}>
                  實驗流程
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default HomePage
