import '../styles/globals.css'
import '../styles/react-pdf-styles.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/layout'
import { NotificationContextProvider } from '../store/notification-context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NotificationContextProvider>
  )
}
