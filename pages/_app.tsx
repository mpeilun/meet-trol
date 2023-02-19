import '../styles/globals.css'
import '../styles/react-pdf-styles.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/layout'
import { NotificationContextProvider } from '../store/notification-context'
import { Provider } from 'react-redux'
import store from '../store/store'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <NotificationContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NotificationContextProvider>
    </Provider>
  )
}
