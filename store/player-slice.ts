import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

const initialState = {
  playedSecond: 0,
}

export const playerSlice = createSlice({
  name: 'player',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setPlayedSecond: (state, action: PayloadAction<number>) => {
      state.playedSecond = action.payload
    },
  },
})

export const { setPlayedSecond } = playerSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPlayerSecond = (state: RootState) => state.player.playedSecond

export default playerSlice.reducer
