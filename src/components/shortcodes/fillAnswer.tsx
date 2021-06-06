import React from 'react';
import TextField from '@material-ui/core/TextField';

import { getChildAtIndex } from "../../utils/children";
import { useAnswerValue } from "./answer";
import { withFeedback } from "./withFeedback";


type FillStringProps = {
    children: React.ReactNode,
    solution: string,
};

export const FillString = ({ children, solution }: FillStringAnswerProps) => {
    const explanation = getChildAtIndex(children, 0) || null;
    const evaluateAnswerValue = (v: string|null) => v === String(solution);
    const {answerValue, setAnswerValue, showingSolution} = useAnswerValue(evaluateAnswerValue, solution, explanation);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            setAnswerValue(null);
        } else {
            setAnswerValue(String(e.target.value));
        }
    }

    return (
        <TextField disabled={showingSolution} variant="filled" onChange={handleChange}
            placeholder={showingSolution && answerValue !== null ? answerValue : "Vul in"} value={answerValue !== null ? answerValue : "" } />
    );
};

export const FillStringWithFeedback = withFeedback(FillString);