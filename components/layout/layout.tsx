import { Fragment, ReactNode, useContext } from 'react'
import MainHeader from './main-header'
import Notification from '../ui/notification'
import NotificationContext from '../../store/notification-context'

function Layout(props: { children: ReactNode }) {
  const notificationCtx = useContext(NotificationContext)

  const activeNotification = notificationCtx?.notification

  return (
    <Fragment>
      <MainHeader />
      <main>{props.children}</main>
      {activeNotification && <Notification type={activeNotification.status} title={activeNotification.title} message={activeNotification.message} />}
    </Fragment>
  )
}

export default Layout
