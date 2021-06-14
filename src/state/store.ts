import { configureStore } from '@reduxjs/toolkit'

import answersReducer from './answersSlice'
import exerciseReducer from './exercisesSlice'
import exerciseSteppersReducer from './exerciseSteppersSlice'


const store = configureStore({
    reducer: {
        answers: answersReducer,
        exercises: exerciseReducer,
        exerciseSteppers: exerciseSteppersReducer,
    }
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
