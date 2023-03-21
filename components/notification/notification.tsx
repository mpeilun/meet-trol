import { useState, forwardRef, Dispatch, SetStateAction } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { notification, setOpen } from '../../store/notification'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { duration } from 'dayjs'

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const defaultDuration = (duration: string) => {
  if (duration == 'short') return 1000
  else if (duration == 'long') return 2000
  else return 1500
}

function Notification(props: notification) {
  const { open, severity, message, duration } = props
  const dispatch = useAppDispatch()

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    dispatch(setOpen(false))
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={defaultDuration(duration)}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notification
