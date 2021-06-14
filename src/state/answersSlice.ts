import { createSlice } from '@reduxjs/toolkit'

import { AnswerType } from '../components/shortcodes/answer'


const initialState = [] as AnswerType<any>[];

const answersSlice = createSlice({
    name: 'answers',
    initialState,
    reducers: {
        answerAdded(state, action) {
            state.push(action.payload);
        },
        answerChanged(state, action) {
            const answerIdx = state.findIndex(a => a.id === action.payload.id);
            state[answerIdx] = action.payload;
        },
    }
})

export const { answerAdded, answerChanged } = answersSlice.actions

export default answersSlice.reducer
