import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { InteractionLog } from '@prisma/client'

const initialState = {
  playedSecond: 0,
  eyeTracking: { x: 0, y: 0 },
  questionLocate: { w: 0, h: 0, xStart: 0, xEnd: 0, yStart: 0, yEnd: 0 },
  lookingQuestion: false,
  videoId: '',
  videoTime: 0,
}

export const courseSlice = createSlice({
  name: 'courseData',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setPlayedSecond: (state, action: PayloadAction<number>) => {
      state.playedSecond = action.payload
    },
    updateEyeTracking: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.eyeTracking = action.payload
    },
    setQuestionLocate: (
      state,
      action: PayloadAction<{
        w: number
        h: number
        xStart: number
        xEnd: number
        yStart: number
        yEnd: number
      }>
    ) => {
      state.questionLocate = action.payload
    },
    isLooking: (state, action: PayloadAction<boolean>) => {
      state.lookingQuestion = action.payload
    },
    setVideoId: (state, action: PayloadAction<string>) => {
      state.videoId = action.payload
    },
    setVideoTime: (state, action: PayloadAction<number>) => {
      state.videoTime = action.payload
    },
    
  },
})

export const {
  setPlayedSecond,
  updateEyeTracking,
  setQuestionLocate,
  isLooking,
  setVideoId,
  setVideoTime,
} = courseSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPlayerSecond = (state: RootState) =>
  state.course.playedSecond
export const selectEyeTracking = (state: RootState) => state.course.eyeTracking
export const selectQuestionLocate = (state: RootState) =>
  state.course.questionLocate
export const selectLookingQuestion = (state: RootState) =>
  state.course.lookingQuestion
export const selectVideoId = (state: RootState) => state.course.videoId
export const selectVideoTime = (state: RootState) => state.course.videoTime


export default courseSlice.reducer
