import { configureStore } from '@reduxjs/toolkit'
import courseReducer from './course-data'
import notificationReducer from './notification'

export const store = configureStore({
  reducer: {
    course: courseReducer,
    notification: notificationReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
