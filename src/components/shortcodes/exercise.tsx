import React, { useContext, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';

import { useStore, Store, GetNextElementsType } from '../store';
import { AnswerType } from "./answer";
import { ExercisesFeedback } from "./exerciseFeedback";
import Paper from '../paper';


export interface ExerciseType {
    answers: AnswerType<any>[];
};

interface ExerciseProps {
    children: React.ReactNode;
}

export const Exercise = ({ children }: ExerciseProps) => {
    const [exercise, setExercise, usingContext] = useStore<ExerciseType>();

    const answersExist = exercise && Array.isArray(exercise.answers);
    const getAnswers = () => {
        if (answersExist) {
            return exercise.answers;
        } else {
            return [];
        }
    };

    const setAnswers = (getNextAnswers: GetNextElementsType<any>) => {
        const nextAnswers = getNextAnswers(getAnswers());
        setExercise({
            answers: nextAnswers
        });
    };
    
    const allAnswered = (
        answersExist ?
        exercise.answers.every(ans => ans.answered)
        : false
    );
    
    const allShowingSolutions = (
        answersExist ?
        exercise.answers.every(ans => ans.showingSolution)
        : false
    );
    
    const showSolutions = () => {
        if (!answersExist) { return };
        setExercise(
            {
                answers: exercise.answers.map(ans =>
                    ({ ...ans, showingSolution: true })
                )
            }
        );
    };
    
    const handleReset = () => {
        if (!answersExist) { return };
        setExercise(
            {
                answers: exercise.answers.map(_ans => ({} as AnswerType<any>))
            }
        );
    };

    return (
        <Store elements={getAnswers()} setElements={setAnswers}>
            {
            usingContext ?
            children
            :
            <Paper>
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
        </Store>
    );
};
