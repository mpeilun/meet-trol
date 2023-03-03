import { Fragment, ReactNode, useContext } from 'react'
import MainNavigation from './main-navigation'
import { ThemeProvider, GlobalStyles, CssBaseline, Box } from '@mui/material'
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
        <Box
          display="flex"
          //TODO危險
          // width="100vw"
          // ?? 下面不確定要不要加上
          // overflow={'hidden'}
          height="100vh"
          sx={{ flexDirection: 'column' }}
        >
          {asPath !== '/auth/signin' && <MainNavigation />}
          <main style={{ height: '100%' }}>{props.children}</main>
        </Box>
      </ThemeProvider>
    </>
  )
}

export default Layout
