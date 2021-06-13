import React, { useContext, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';

import { useStoredElement, Store, GetNextElementsType } from '../store';
import { AnswerType } from "./answer";
import { ExercisesFeedback } from "./exerciseFeedback";
import Paper from '../paper';


export type ExerciseType = AnswerType<any>[];

interface ExerciseProps {
    children: React.ReactNode;
}


export const Exercise = ({ children }: ExerciseProps) => {
    const [answers, setAnswers, usingContext] = useStoredElement<ExerciseType>([]);
    // const [answers, setAnswers] = React.useState<ExerciseType>([]);
    // const usingContext = false;

    const allAnswered = (
        Array.isArray(answers) && answers.length > 0 && answers.every(ans => ans.answered)
    );

    const allShowingSolutions = (
        Array.isArray(answers) && answers.length > 0 && answers.every(ans => ans.showingSolution)
    );

    const showSolutions = () => {
        setAnswers(
            answers.map(ans =>
                ({ ...ans, showingSolution: true })
            )
        );
    };

    const handleReset = () => {
        setAnswers(
            answers.map(ans => ({
                ...ans,
                value: null,
                answered: false,
                correct: false,
                showingSolution: false,
            }))
        );
    };
    
    const setElements = (getNextAnswers) => {
        console.log(`Calling setAnswers with argument ${getNextAnswers}`);
        setAnswers(prevAnswers => {
            console.log(`Calling getNextAnswers...`);
            const newAnswers = getNextAnswers(prevAnswers);
            console.log(`Set new answers of exercise to ${JSON.stringify(newAnswers)} (usingContext ${usingContext})`);
            return newAnswers;
        });
    };

    return (
        <Store elements={answers} setElements={setElements} name="exerciseStore">
            {
            usingContext ?
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
        </Store>
    );
};
