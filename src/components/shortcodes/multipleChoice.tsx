import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getChildAtIndex } from "../../utils/children";
import { useAnswerValue } from "./answer";
import { withFeedback } from "./withFeedback";


type MultipleChoiceProps = {
    children: React.ReactNode,
    solution: number
};

export const getChoices = (children: React.ReactNode) => {
    const choicesUl = getChildAtIndex(children, 0);
    
    if (!choicesUl || !choicesUl.props) {
        console.error("No choices defined.");
        return [];
    }
    
    const listItems = React.Children.toArray(choicesUl.props.children) as React.ReactElement<MDXElementProps>[];
    return listItems.map(c => c.props.children);
};


export const MultipleChoice = ({ children, solution }: MultipleChoiceProps) => {
    const choices = getChoices(children);
    const solutionNode = choices[solution];
    const explanation = getChildAtIndex(children, 1) || null;
    const evaluateAnswerValue = (v: number|null) => v === solution;

    const {answerValue, setAnswerValue, showingSolution} = useAnswerValue(evaluateAnswerValue, solutionNode, explanation);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswerValue(e.target ? Number(e.target.value) : null);
    };

    return (
        <RadioGroup value={answerValue} onChange={handleChange}>
            {
                choices?.map((choice, index) => (
                    <FormControlLabel key={index} value={index} control={<Radio />} label={choice} disabled={showingSolution} />
                ))
            }
        </RadioGroup>
    );
};

export const MultipleChoiceWithFeedback = withFeedback(MultipleChoice);