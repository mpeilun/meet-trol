import '../styles/globals.css'
import '../styles/react-pdf-styles.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/layout'
import { Provider } from 'react-redux'
import store from '../store/store'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </Provider>
  )
}
