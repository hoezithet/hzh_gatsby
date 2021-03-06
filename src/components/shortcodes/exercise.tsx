import React, { useContext, useEffect, useRef } from 'react';
import { Store, StoreContext, StoreContextType } from '../store';
import { AnswerType } from "./answer";

export interface ExerciseType {
    answers: AnswerType[];
};

interface ExerciseProps {
    children: React.ReactNode;
}

export const Exercise = ({ children }: ExerciseProps) => {
    const { registerElement, setElement, getElement } = useContext(StoreContext) as StoreContextType<ExerciseType>;
    const exerciseIdRef = useRef(-1);

    useEffect(() => {
        registerElement((id) => {
            exerciseIdRef.current = id;
        });
    }, []);

    const getAnswers = () => {
        const exercise = getElement(exerciseIdRef.current);
        if (exercise && exercise.answers) {
            return exercise.answers;
        } else {
            return [];
        }
    };

    const setAnswers = (getNextAnswers: (currentAnswers: AnswerType[]) => AnswerType[]) => {
        const id = exerciseIdRef.current;
        if (id !== -1) {
            const nextAnswers = getNextAnswers(getAnswers());
            setElement(exerciseIdRef.current, {
                answers: nextAnswers
            });
        }
    };

    return (
        <Store elements={getAnswers()} setElements={setAnswers}>
            { children }
        </Store>
    );
};