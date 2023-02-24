import { Fragment, ReactNode, useContext } from 'react'
import MainNavigation from './main-navigation'
import { ThemeProvider, GlobalStyles, CssBaseline } from '@mui/material'
import theme, { themeFont } from '../../styles/material-theme'
import Head from 'next/head'
import { grey } from '@mui/material/colors'
import { useRouter } from 'next/router'

function Layout(props: { children: ReactNode }) {
  const { asPath } = useRouter()

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
        {asPath !== '/auth/signin' && <MainNavigation />}
        <main>{props.children}</main>
      </ThemeProvider>
    </>
  )
}

export default Layout
