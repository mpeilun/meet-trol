import { Alert, AlertColor, Snackbar } from '@mui/material'
import { useContext, useState } from 'react'
import NotificationContext from '../../store/notification-context'

function Notification(props: { type: string; title: string; message: string }) {
  const notificationCtx = useContext(NotificationContext)

  const handleClose = () => {
    notificationCtx?.hideNotificationHandler()
  }

  return (
    <Snackbar open={true} autoHideDuration={3000} onClose={handleClose}>
      <Alert severity={props.type as AlertColor} onClick={handleClose}>
        <strong>{props.title}</strong> - {props.message}
      </Alert>
    </Snackbar>
  )
}

export default Notification
