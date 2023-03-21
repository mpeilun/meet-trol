import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

export interface notification {
  open: boolean
  severity: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: 'short' | 'long'
}

const initialState: notification = {
  open: false,
  severity: 'info',
  message: 'default message',
  duration: 'short',
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<Omit<notification, 'open'>>) => {
      state.open = true
      state.severity = action.payload.severity
      state.message = action.payload.message
      state.duration = action.payload.duration
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
  },
})

export const { sendMessage, setOpen } = notificationSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectNotification = (state: RootState) => state.notification

export default notificationSlice.reducer
