// import Link from 'next/link'
// import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material'
// import { CourseDataType, getAllCourses } from '../lib/dummy-data'
import { useContext, useState } from 'react'
import Image from 'next/image'
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Modal,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useAppDispatch } from '../hooks/redux'
import React from 'react'
import GoButton from '../components/goButton'

function HomePage() {
  const router = useRouter()
  const { data: session } = useSession()

  const [modalOpen, setModalOpen] = useState(false)

  const handleModalOpen = () => {
    setModalOpen(true)
  }
  const handleModalClose = () => {
    setModalOpen(false)
  }

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
              sx={{ pt: 2 }}
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
                <Typography
                  variant={'h6'}
                  sx={{ fontWeight: 'bold', textAlign: 'justify' }}
                >
                  親愛的使用者您好：
                </Typography>
                <div style={{ paddingLeft: '8px' }}>
                  <ol>
                    <li>請先進行登入</li>
                    <li>登入成功回到此頁</li>
                    <li>點擊『開始測試』</li>
                    <li>協助我們完成進行測試</li>
                  </ol>
                </div>
                <Typography
                  sx={{
                    textAlign: 'justify',
                    marginTop: '12px',
                  }}
                >
                  感謝您的參與，您的幫助對我們非常重要！
                </Typography>
                {/* <Typography color={grey[600]} sx={{ textAlign: 'justify' }}>
                  線上影片學習系統，透過互動問題與眼球追蹤技術，
                  分析學生對課程內容的理解程度，使教育者能夠調整教學內容，提升學習的效率。
                </Typography> */}
              </Box>
              <Box>
                {/* <Button
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
                </Button> */}
                {/* 彈出測試流程流程 */}
                <Modal open={modalOpen} disableAutoFocus>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      maxHeight: '80vh',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '90%',
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      p: 4,
                    }}
                  >
                    <iframe
                      src="https://www.youtube.com/embed/4kZsvnQQLv4"
                      height={400}
                      style={{
                        height: '80vh',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        border: '2px solid #ccc',
                        borderRadius: '10px',
                      }}
                      title="測試流程說明"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <Typography textAlign={'center'} sx={{ marginTop: '16px' }}>
                      請觀看測試流程說明！
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'end',
                      }}
                    >
                      <Button
                        disableElevation
                        variant="contained"
                        size="large"
                        color="success"
                        onClick={() => {
                          {
                            router.push('/courses')
                          }
                        }}
                        sx={{
                          fontSize: '22px',
                          fontWeight: 600,
                          px: 3.5,
                          py: 1,
                          borderRadius: 8,
                        }}
                      >
                        <Typography>{'下一步'}</Typography>
                      </Button>
                    </Box>
                  </Card>
                </Modal>
                <GoButton handleModalOpen={handleModalOpen} />

                {/* <Button 
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
                </Button> */}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default HomePage
