import { createSlice } from '@reduxjs/toolkit'

import { ExerciseStepperType } from '../components/shortcodes/exerciseStepper'
import { RootState } from './store'


const initialState = [] as ExerciseStepperType[];

const getIdxFromId = (state: typeof initialState, id: string) => {
    return state.findIndex(exerciseStepper => exerciseStepper.id === id);
}

const exerciseSteppersSlice = createSlice({
    name: 'exerciseSteppers',
    initialState,
    reducers: {
        exerciseStepperAdded(state, action) {
            state.push(action.payload);
        },
        exerciseStepAdded(state, action) {
            const stepperIdx = getIdxFromId(state, action.payload.exerciseStepperId);
            if (stepperIdx === -1) { return }
            state[stepperIdx]['exerciseIds'].push(action.payload.exerciseId);
        },
        removeExerciseStepper(state, action) {
            const stepperIdx = getIdxFromId(state, action.payload.id);
            if (stepperIdx === -1) { return }
            state.splice(stepperIdx, 1);
        },
    }
})

export const { exerciseStepperAdded, exerciseStepAdded, removeExerciseStepper } = exerciseSteppersSlice.actions

export default exerciseSteppersSlice.reducer
