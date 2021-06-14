import { createSlice } from '@reduxjs/toolkit'

import { ExerciseType } from '../components/shortcodes/exercise'
import { RootState } from './store'


const initialState = [] as ExerciseType[];

const getIdxFromId = (state: typeof initialState, id: string) => {
    return state.findIndex(exercise => exercise.id === id);
}

const exercisesSlice = createSlice({
    name: 'exercises',
    initialState,
    reducers: {
        exerciseAdded(state, action) {
            state.push(action.payload);
        },
        exerciseChanged(state, action) {
            const idx = getIdxFromId(state, action.payload.id);
            if (idx === -1) { return }
            state[idx] = action.payload;
        },
        exerciseAnswerAdded(state, action) {
            const exIdx = getIdxFromId(state, action.payload.exerciseId);
            if (exIdx === -1) { return }
            state[exIdx]['answerIds'].push(action.payload.answerId);
        },
    }
})

export const { exerciseAdded, exerciseChanged, exerciseAnswerAdded } = exercisesSlice.actions

export default exercisesSlice.reducer
