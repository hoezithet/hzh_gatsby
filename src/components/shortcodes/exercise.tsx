import React, { useContext, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';

import { useStore, Store } from '../store';
import { AnswerType } from "./answer";
import { ExercisesFeedback } from "./exerciseFeedback";
import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';

export interface ExerciseType {
    answers: AnswerType<any>[];
};

interface ExerciseProps {
    children: React.ReactNode;
}

const useStyles = makeStyles({
    paper: {
        padding: props => `${props.theme.spacing(2)}px`,
        margin: props => `${props.theme.spacing(1)}px`,
        breakInside: "avoid",
    }
});

export const Exercise = ({ children }: ExerciseProps) => {
    const [exercise, setExercise, usingContext] = useStore<ExerciseType>();
    const theme = useTheme();
    const classes = useStyles({ theme });

    const answersExist = exercise && Array.isArray(exercise.answers);
    const getAnswers = () => {
        if (answersExist) {
            return exercise.answers;
        } else {
            return [];
        }
    };

    const setAnswers = (getNextAnswers) => {
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
                answers: exercise.answers.map(_ans => ({} as AnswerType))
            }
        );
    };

    return (
        <Store elements={getAnswers()} setElements={setAnswers}>
            { usingContext ?
              children
              : <Paper className={classes.paper}>
            { children }
            { allShowingSolutions ?
                <Button onClick={handleReset}>
                    { "Begin opnieuw" }
                </Button>
                : null }
            { !allShowingSolutions ? (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!allAnswered}
                        onClick={showSolutions}
                    >
                        {"Toon feedback"}
                    </Button>
                ) : null}
            </Paper> }
        </Store>
    );
};
