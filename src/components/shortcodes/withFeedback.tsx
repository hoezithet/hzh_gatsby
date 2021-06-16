import React, { useContext, useRef } from "react";

import { useStoredElement, StoreContext, StoreContextType } from '../store';
import { AnswerFeedback } from './answerFeedback';
import { AnswerType } from './answer';
import { ExerciseContext } from './exercise'
import Button from '@material-ui/core/Button';

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { RootState } from '../../state/store'


type WithFeedbackProps = {
    solution: React.ReactNode,
    explanation?: React.ReactNode,
    correct: boolean,
    children: React.ReactNode
};

export const withFeedback = <P extends object, T>(Component: React.ComponentType<P>): React.FC<P & WithFeedbackProps> => {
    return (props: WithFeedbackProps) => {
        const id = useRef(null);
        const answer = useSelector(
            (state: RootState) => state.answers.find(ans => ans.id === id.current)
        );
        const addAnswerToExercise = useContext(ExerciseContext);
        const showFeedback = answer?.showingSolution;
        const usingContext = addAnswerToExercise !== null;

        return (
            <ExerciseContext.Provider
                value={(ansId) => {
                    id.current = ansId;
                    if (addAnswerToExercise !== null) {
                        addAnswerToExercise(ansId);
                    }
                }}
            >
                <Component {...(props as P)} />
                {showFeedback ? (
                    <AnswerFeedback
                        solution={answer?.solution}
                        explanation={answer?.explanation}
                        correct={answer?.correct}
                    />
                ) : null}
                {!usingContext && !showFeedback ? (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!(answer && answer.answered)}
                        onClick={() => answer ? setAnswer({ ...answer, showingSolution: true }) : null}
                    >
                        {"Toon feedback"}
                    </Button>
                ) : null}
            </ExerciseContext.Provider>
        );
    };
};
