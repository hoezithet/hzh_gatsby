import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';

import { StoreContext, StoreContextType } from '../store';
import { AnswerFeedback, AnswerFeedbackContext } from './answerFeedback';
import { isNumeric } from "../../utils/number";

interface MDXElementProps {
    mdxType: string;
    originalType: string;
    children: React.ReactNode;
}

interface AnswerProps {
    weight?: number;
    correct: number | string | number[];
    margin?: number;
    children: React.ReactNode;
}

export type AnswerOptionType = number | string;

export type AnswerValueType = AnswerOptionType[];

export type AnswerType = {
    value: AnswerValueType,
    correct: boolean,
    answered: boolean,
    showFeedback: boolean
};

export const FILL_IN = "fill";
export const MULTIPLE_CHOICE = "multiple choice";
export const MULTIPLE_ANSWER = "multiple answer";

export const getAnswerType = (options: AnswerOptionType[], correctOptions: AnswerOptionType[]) => (
    options.length === 0
        ?
        FILL_IN
        :
        (correctOptions.length == 1
            ?
            MULTIPLE_CHOICE
            :
            MULTIPLE_ANSWER)
);

const optEqual = (opt1: AnswerOptionType, opt2: AnswerOptionType, margin: number) => {
    const strOpt1 = String(opt1).replace(",", ".");
    const strOpt2 = String(opt2).replace(",", ".");
    if (isNumeric(strOpt1) && isNumeric(strOpt2)) {
        const numOpt1 = Number(strOpt1);
        const numOpt2 = Number(strOpt2);
        return (
            (numOpt1 - margin < numOpt2
                || numOpt1 - margin === numOpt2)
            &&
            (numOpt1 + margin > numOpt2
                || numOpt1 + margin === numOpt2)
        );
    } else {
        return opt1 === opt2;
    }
};

export const evaluateAnsweredOptions = (
    answeredOptions: AnswerValueType,
    correctOptions: AnswerValueType,
    margin: number
) => {
    return (
        // All correct answers should be given...
        correctOptions.every(
            corrOpt => answeredOptions.some(
                ansOpt => optEqual(corrOpt, ansOpt, margin)
            )
        )
        // ...and all given answers should be correct
        && answeredOptions.every(
            ansOpt => correctOptions.some(
                corrOpt => optEqual(corrOpt, ansOpt, margin)
            )
        )
    )
};

export const Answer = ({ children, correct, margin = 0.01 }: AnswerProps) => {
    let feedback = null;
    let options: AnswerOptionType[] = [];
    if (children) {
        const childArray = React.Children.toArray(children) as React.ReactElement<MDXElementProps>[];
        feedback = childArray.length >= 2 ? childArray[1] : null;
        const optionsList = childArray.length >= 1 ? childArray[0] : null;
        if (optionsList && optionsList.props) {
            const listItems = React.Children.toArray(optionsList.props.children) as React.ReactElement<MDXElementProps>[];
            options = listItems.map(c => c.props.children) as string[];
        }
    }
    feedback = feedback || <AnswerFeedback />;

    const correctOptions = Array.isArray(correct) ? correct : [correct];
    const answerType = getAnswerType(options, correctOptions);

    const answerIdRef = useRef(-1);
    const [answer, setAnswer] = useState(null);  // Only used when there's no context
    let { registerElement, setElement, getElement } = useContext(StoreContext) as StoreContextType<AnswerType>;
    let usingContext = true;
    if (!(registerElement && setElement && getElement)) {
        registerElement = (idCallback) => idCallback(0);
        setElement = (_id, ans) => setAnswer(ans);
        getElement = (_id) => answer;
        usingContext = false;
    }

    useEffect(() => {
        registerElement((assignedId) => answerIdRef.current = assignedId);
    }, []);

    useEffect(() => {
        setAnsweredOption([]);
    }, [answerIdRef.current]);

    const getChildrenArray = (children: React.ReactNode): React.ReactNode[] => {
        const childArr = React.Children.toArray(children);
        if (childArr.length === 1) {
            return getChildrenArray(childArr[0]);
        } else {
            return childArr;
        }
    };

    const getCurrentAnswer = useCallback(() => {
        return getElement(answerIdRef.current);
    }, [getElement, answerIdRef.current]);


    const getAnswerValue = () => {
        const currentAnswer = getCurrentAnswer();
        if (currentAnswer && currentAnswer.value !== undefined) {
            return currentAnswer.value;
        } else {
            return [];
        }
    };

    const showFeedback = () => {
        const currentAnswer = getCurrentAnswer();
        if (currentAnswer && currentAnswer.showFeedback !== undefined) {
            return currentAnswer.showFeedback;
        } else {
            return false;
        }
    };

    const setAnsweredOption = useCallback((newValue: AnswerValueType) => {
        setElement(answerIdRef.current,
            {
                value: newValue,
                correct: evaluateAnsweredOptions(newValue, correctOptions, margin),
                answered: newValue.length > 0,
                showFeedback: false
            });
    }, [setElement]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (answerType === FILL_IN) {
            setAnsweredOption([e.target.value]);
        } else {
            const val = Number(e.target.value);
            if (answerType === MULTIPLE_ANSWER) {
                if (e.target.checked) {
                    setAnsweredOption([...getAnswerValue(), val]);
                } else {
                    setAnsweredOption([...getAnswerValue().filter(ans => ans !== val)]);
                }
            } else {
                setAnsweredOption([val]);
            }
        }
    };

    const ansValue = getAnswerValue();
    const answerComp = useMemo(() => {
        switch (answerType) {
            case FILL_IN: {
                const valueType = typeof (correctOptions[0]);
                const filledValue = ansValue.length > 0 ? `${ansValue[0]}` : "";
                return (
                    <TextField disabled={showFeedback()} variant="filled" onChange={handleChange}
                        placeholder={showFeedback() ? filledValue : "Vul in"} value={filledValue} />
                );
            }
            case MULTIPLE_CHOICE: {
                const chosenIdx = ansValue.length > 0 ? ansValue[0] : null;
                return (
                    <RadioGroup value={chosenIdx} onChange={handleChange}>
                        {
                            options.map((option, index) => (
                                <FormControlLabel key={index} value={index} control={<Radio />} label={option} disabled={showFeedback()} />
                            ))
                        }
                    </RadioGroup>
                );
            }
            case MULTIPLE_ANSWER: {
                return (
                    <FormGroup>
                        {
                            options.map((option: AnswerOptionType, index: number) => (
                                <FormControlLabel
                                    key={index}
                                    control={<Checkbox value={index} checked={getAnswerValue().includes(index)} onChange={handleChange} />}
                                    label={option}
                                    disabled={showFeedback()} />
                            ))
                        }
                    </FormGroup>
                );
            }
        }
    }, [ansValue, showFeedback(), handleChange]);

    const ctxValue = {
        options: options,
        answeredOptions: getAnswerValue(),
        correctOptions: correctOptions,
        margin: margin,
        showFeedback: showFeedback()
    };

    return (
        <AnswerFeedbackContext.Provider value={ctxValue}>
            { answerComp }
            { feedback }
            {
                 !usingContext && !showFeedback()
                 ?
                 <Button variant="contained"
                      color="primary"
                      disabled={!(answer && answer.answered)}
                      onClick={() => setAnswer((prevAnswer) => ({...prevAnswer, showFeedback: true}))}>
                      { "Toon feedback" }
                 </Button>
                 :
                 null
             }
        </AnswerFeedbackContext.Provider>
    );
};
