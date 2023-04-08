// import Link from 'next/link'
// import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material'
// import { CourseDataType, getAllCourses } from '../lib/dummy-data'
import CourseList from '../components/courses/course-list'
import { useContext } from 'react'
import Image from 'next/image'
import { Box, Button, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

function HomePage() {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <>
      <Box
        height="100%"
        display="flex"
        flexDirection="row"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          width={'30%'}
        >
          <Image
            width={300}
            height={300}
            style={{
              objectFit: 'contain',
            }}
            alt={'Meet-Trol LOGO'}
            src={'/images/logo.png'}
          />
          <Typography variant="h2" fontWeight={400} color={'white'}>
            Meet-Trol
          </Typography>
        </Box>
        <Box
          display={'flex'}
          height={'50%'}
          width={'270px'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ marginLeft: 8 }}
        >
          <Typography
            sx={{ textAlign: 'justify', marginTop: '64px', color: 'white' }}
          >
            線上影片學習系統，透過互動問題與眼球追蹤技術，
            分析學生對課程內容的理解程度，使教育者能夠調整教學內容，提升學習的效率。
          </Typography>
          <Button
            color={'custom_bottom'}
            variant="contained"
            size="large"
            onClick={() => {
              {
                session ? window.open('/courses') : window.open('/auth/signin')
              }
            }}
            sx={{
              marginTop: '32px',
              borderRadius: '6px',
            }}
          >
            <Typography color={'white'}>
              {session ? '開始上課' : '登入體驗'}
            </Typography>
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default HomePage
