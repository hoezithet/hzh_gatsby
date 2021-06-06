import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { useStore } from '../store';


export type AnswerType<T> = {
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
    const [answer, setAnswer] = useStore<AnswerType<T>>();

    const setAnswerValue = (newValue: T|null) => {
        setAnswer({
                value: newValue,
                correct: evaluateAnswerValue(newValue),
                answered: newValue !== null,
                solution: solution,
                explanation: explanation,
                showingSolution: answer?.showingSolution || false,
            });
    };
    return {answerValue: answer?.value !== undefined ? answer.value : null, setAnswerValue: setAnswerValue, showingSolution: answer?.showingSolution || false};
}