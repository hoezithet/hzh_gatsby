import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { RootState } from '../../state/store'

import { answerAdded, answerChanged } from '../../state/answersSlice'


export type AnswerType<T> = {
    id: string,
    value: T|null,
    correct: boolean,
    answered: boolean,
    explanation?: React.ReactNode,
    solution: React.ReactNode,
    showingSolution: boolean,
};

export function useAnswerValue<T> (
    evaluateAnswerValue: (v: T|null) => boolean,
    solution: React.ReactNode|React.ReactNode[],
    explanation: React.ReactNode,
): {answerValue: T|null, setAnswerValue: (newValue: T|null) => void, showingSolution: boolean} {
    const id = useRef("");
    const answer = useSelector(
        (state: RootState) => state.answers.find(ans => ans.id === id.current)
    );

    const dispatch = useDispatch();

    useEffect(() => {
        id.current = nanoid();
        dispatch(
            answerAdded({
                id: id.current,
                value: null,
                correct: false,
                answered: false,
                solution: solution,
                explanation: explanation,
                showingSolution: false,
            })
        )
    }, []);

    const setAnswerValue = (newValue: T|null) => {
        dispatch(
            answerChanged({
                ...answer,
                value: newValue,
                correct: evaluateAnswerValue(newValue),
                answered: newValue !== null,
            })
        )
    };
    return {answerValue: answer?.value !== undefined ? answer.value : null, setAnswerValue: setAnswerValue, showingSolution: answer?.showingSolution || false};
}
