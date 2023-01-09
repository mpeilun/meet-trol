import { createContext, ReactNode, useState } from 'react'

interface notificationType {
  title: string
  message: string
  status: string
}

const NotificationContext = createContext<{ notification: notificationType | null | undefined; showNotificationHandler: Function; hideNotificationHandler: Function } | undefined>(undefined)

export function NotificationContextProvider(props: { children?: ReactNode }) {
  const [activeNotification, setActiveNotification] = useState<notificationType | undefined | null>(undefined)

  function showNotificationHandler(notificationData: notificationType) {
    setActiveNotification(notificationData)
  }

  function hideNotificationHandler(notificationData: notificationType) {
    setActiveNotification(null)
  }

  const context = { notification: activeNotification, showNotificationHandler: showNotificationHandler, hideNotificationHandler: hideNotificationHandler }

  return <NotificationContext.Provider value={context}>{props.children}</NotificationContext.Provider>
}

export default NotificationContext
