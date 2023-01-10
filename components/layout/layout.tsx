import { Fragment, ReactNode, useContext } from 'react'
import MainNavigation from './main-navigation'
import Notification from '../ui/notification'
import NotificationContext from '../../store/notification-context'
import { ThemeProvider, GlobalStyles, CssBaseline } from '@mui/material'
import theme, { themeFont } from '../../styles/material-theme'
import Head from 'next/head'
import { grey } from '@mui/material/colors'

function Layout(props: { children: ReactNode }) {
  const notificationCtx = useContext(NotificationContext)

  const activeNotification = notificationCtx?.notification

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
            body: { margin: 0, backgroundColor: grey[200] },
          }}
        />
        <MainNavigation />
        <main>{props.children}</main>
        {activeNotification && <Notification type={activeNotification.status} title={activeNotification.title} message={activeNotification.message} />}
      </ThemeProvider>
    </>
  )
}

export default Layout
