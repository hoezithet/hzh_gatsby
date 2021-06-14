import React, { createContext, useContext, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'

import { useStoredElement, Store, GetNextElementsType } from '../store';
import { AnswerType } from "./answer";
import { ExerciseStepperContext } from './exerciseStepper';
import { ExercisesFeedback } from "./exerciseFeedback";
import Paper from '../paper';

import { RootState } from '../../state/store'
import { exerciseAdded, exerciseAnswerAdded } from '../../state/exercisesSlice';
import { answerChanged, showAnswerSolution, resetAnswer } from '../../state/answersSlice'


export type ExerciseType = {
    id: string,
    answerIds: string[],
    nCorrect: number,
    showingSolution: boolean
}

interface ExerciseProps {
    children: React.ReactNode;
}

type ExerciseContextValueType = ((answerId: string) => void);

export const ExerciseContext = createContext<ExerciseContextValueType|null>(null);


export const Exercise = ({ children }: ExerciseProps) => {
    const id = useRef(nanoid());

    const exercise = useSelector(
        (state: RootState) => state.exercises.find(exercise => exercise.id === id.current)
    );

    const answers = useSelector(
        (state: RootState) => {
            return exercise?.answerIds.map(ansId =>
                state.answers.find(ans => ans.id === ansId)
            );
        }
    )

    const addExerciseIdToStepper = useContext(ExerciseStepperContext);
    const dispatch = useDispatch();

    if (!exercise) {
        dispatch(
            exerciseAdded({
                id: id.current,
                answerIds: [],
                nCorrect: 0,
                showingSolution: false
            })
        )
        if (addExerciseIdToStepper !== null) {
            addExerciseIdToStepper(id.current)
        }
    }

    const addAnswerId = (answerId: string) => {
        dispatch(
            exerciseAnswerAdded({
                exerciseId: id.current,
                answerId: answerId,
            })
        )
    }

    const allAnswered = (
        Array.isArray(answers) && answers.length > 0 && answers.every(ans => ans?.answered)
    );

    const allShowingSolutions = (
        Array.isArray(answers) && answers.length > 0 && answers.every(ans => ans?.showingSolution)
    );

    const showSolutions = () => {
        answers?.forEach(ans => {
            dispatch(
                showAnswerSolution({
                    id: ans?.id
                })
            )
        });
    };

    const handleReset = () => {
        answers?.forEach(ans => {
            dispatch(
                resetAnswer({
                    id: ans?.id
                })
            )
        });
    };

    const insideStepper = addExerciseIdToStepper !== null;

    return (
        <ExerciseContext.Provider value={addAnswerId}>
            {
            insideStepper ?
            children
            :
            <Paper>
                <p>{ JSON.stringify(answers) }</p>
                { children }
                {
                allShowingSolutions ?
                <Button onClick={handleReset}>
                    { "Begin opnieuw" }
                </Button>
                : null
                }
                {
                !allShowingSolutions ?
                <Button variant="contained"
                    color="primary"
                    disabled={!allAnswered}
                    onClick={showSolutions} >
                    {"Toon feedback"}
                </Button>
                : null
                }
            </Paper>
            }
        </ExerciseContext.Provider>
    );
};
