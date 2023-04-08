import { Fragment, ReactNode, useContext } from 'react'
import MainNavigation from './main-navigation'
import { ThemeProvider, GlobalStyles, CssBaseline, Box } from '@mui/material'
import theme, { themeFont } from '../../styles/material-theme'
import Head from 'next/head'
import { grey } from '@mui/material/colors'
import { useRouter } from 'next/router'
import Notification from '../notification/notification'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'

function Layout(props: { children: ReactNode }) {
  const { asPath } = useRouter()

  const notification = useAppSelector((state) => state.notification)

  return (
    <>
      <Head>
        <title>Meet-Trol</title>
        <meta name="description" content="Interact View LMS System" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              margin: 0,
              backgroundColor:
                asPath.includes('/courses') &&
                asPath.split('/courses/')[1]?.length === 24 &&
                /^[a-f0-9]+$/i.test(asPath.split('/courses/')[1])
                  ? '#fff'
                  : '#FFF3E2',
            },
          }}
        />
        <Box
          display="flex"
          height="100vh"
          sx={{
            flexDirection: 'column',
          }}
        >
          {asPath !== '/auth/signin' && <MainNavigation />}
          <main style={{ height: '100%' }}>{props.children}</main>
          <Notification
            open={notification.open}
            severity={notification.severity}
            message={notification.message}
            duration={notification.duration}
          />
        </Box>
      </ThemeProvider>
    </>
  )
}

export default Layout
