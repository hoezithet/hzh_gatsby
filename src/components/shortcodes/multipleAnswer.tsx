import React from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';

import { getChoices } from "./multipleChoice";
import { getChildAtIndex } from "../../utils/children";
import { useAnswerValue } from "./answer";
import { withFeedback } from "./withFeedback";


type MultipleAnswerProps = {
    children: React.ReactNode,
    solution: number[],
};

export const MultipleAnswer = ({ children, solution }: MultipleAnswerProps) => {
    const choices = getChoices(children);
    const solutionNodes = solution.map(s => choices[s]);
    const explanation = getChildAtIndex(children, 1) || null;
    const evaluateAnswerValue = (v: number[]|null) => {
        if (v === null) { return false };
        if (v.length !== solution.length) { return false };
        return new Set([...v, ...solution]).size === v.length;
    };

    const {answerValue, setAnswerValue, showingSolution} = useAnswerValue(evaluateAnswerValue, solutionNodes, explanation);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (answerValue === null) {
            setAnswerValue([val]);
        } else if (e.target.checked) {
            setAnswerValue([...answerValue, val]);
        } else {
            setAnswerValue([...answerValue.filter(ans => ans !== val)]);
        }
    }

    return (
        <FormGroup>
            {
                choices?.map((choice, index) => (
                    <FormControlLabel
                        key={index}
                        control={<Checkbox value={index} checked={answerValue !== null ? answerValue.includes(index) : false} onChange={handleChange} />}
                        label={choice}
                        disabled={showingSolution} />
                ))
            }
        </FormGroup>
    );
};

export const MultipleAnswerWithFeedback = withFeedback(MultipleAnswer);