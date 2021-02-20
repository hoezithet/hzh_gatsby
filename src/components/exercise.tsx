import React, { useContext, FunctionComponent, useState, useEffect } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import styled from "styled-components";

import { theme } from "./theme";


interface AnswerContextType {
    registerHandler?: (answerIdCallback: AnswerIdCallbackType) => void;
    submitHandler?: (id: number, isCorrect: boolean, isAnswered: boolean) => void;
}

const AnswerContext = React.createContext({
    registerHandler: (answerIdCallback: AnswerIdCallbackType) => {return;},
    submitHandler: (id: number, isCorrect: boolean, isAnswered: boolean) => {return;}
});

// ExerciseContext bevat callbacks van Exercise naar parent
// Om me te delen wanneer oefening juist is opgelost
const ExerciseContext = React.createContext([]);

interface AnswerProps {
    weight?: number;
    correct: number | string | number[];
    margin?: number;
}

const FILL_IN = "fill";
const MULTIPLE_CHOICE = "multiple choice";
const MULTIPLE_ANSWER = "multiple answer";

export const Answer: FunctionComponent<AnswerProps> = ({ children, correct, margin = 0.01 }) => {
    const options = (children && children.props
                     ?
                     (children.props.originalType === "ul"
                     ?
                     children.props.children.map(c => c.props.children)
                     :
                     [])
                     :
                     []);
    const correctAnswers = Array.isArray(correct) ? correct : [correct];
    const answerType = (options.length === 0) ? FILL_IN : (correctAnswers.length == 1) ? MULTIPLE_CHOICE : MULTIPLE_ANSWER;
  
    const [answerId, setAnswerId] = useState(-1);
    const [answerValues, setAnswerValues] = useState<Array<number|string>>([]); 
    const {registerHandler, submitHandler} = useContext(AnswerContext);
    
    useEffect(() => {
        registerHandler((id) => {
            setAnswerId(id);
        });
    }, []);

    const ansEqual = (ans1: number|string, ans2: number|string) => {
        if (ans1 === ans2) {
            return true;
        }
        if (typeof(ans1) !== typeof(ans2)) {
            return false;
        }
        if (typeof(ans1) === "number") {
            return (
                (ans1 - margin < ans2
                    || ans1 - margin === ans2)
                &&
                (ans1 + margin > ans2
                    || ans1 + margin === ans2)
            );
        }
        return false;
    };

    const evaluateAnswers = (answerValues: Array<number|string>) => {
        return (
            // All correct answers should be given...
            correctAnswers.every(
                corrAns => answerValues.some(
                    givAns => ansEqual(corrAns, givAns)
                )
            )
            // ...and all given answers should be correct
            && answerValues.every(
                givAns => correctAnswers.some(
                    corrAns => ansEqual(corrAns, givAns)
                )
            )
    )};
    
    useEffect(() => {
        submitHandler(answerId, evaluateAnswers(answerValues), answerValues.length > 0)
    }, [answerValues]);
    
    const getChildrenArray = (children) => {
        const childArr = React.Children.toArray(children);
        if (childArr.length === 1) {
            return getChildrenArray(childArr[0]);
        } else {
            return childArr;
        }
    };
    
    function isNumeric(str: string) {
        if (typeof str != "string") return false // we only process strings!
        str = str.replace(",", ".");
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    const handleChange = e => {
        if (!isNumeric(String(e.target.value))) {
            if (answerType === FILL_IN) {
                setAnswerValues([]);
            }
            return;
        }
        const val = Number(e.target.value);
        if (answerType === MULTIPLE_ANSWER) {
            if (e.target.checked) {
                setAnswerValues(answerValues => [...answerValues, val]);
            } else {
                setAnswerValues(answerValues => [...answerValues.filter(ans => ans !== val)]);
            }
        } else {
            setAnswerValues([val]);
        }
    };
   
    switch (answerType) {
        case FILL_IN: {
            const valueType = typeof(correctAnswers[0]);
            return (
            <>
                <TextField variant="filled" type={ valueType } onChange={ handleChange } placeholder="Vul in"/>
            </>
            );
        }
        case MULTIPLE_CHOICE: {
            return (
            <>
                <RadioGroup value={answerValues.length > 0 ? answerValues[0] : null} onChange={handleChange}>
                    {
                    options.map((option, index) => (
                    <FormControlLabel key={index} value={index} control={<Radio />} label={ option }/>
                    ))
                    }
                </RadioGroup>
            </>
            );
        }
        case MULTIPLE_ANSWER: {
            return (
            <>
                <FormGroup>
                    {
                    options.map((option, index) => (
                    <FormControlLabel
                        key={index} 
                        control={<Checkbox value={index} checked={ answerValues.includes(index) } onChange={handleChange}/>}
                        label={ option } />
                    ))
                    }
                </FormGroup>
            </>
            );
        }
    }
};

type AnswerIdCallbackType = (id: number) => void;
interface AnswersStateType {
    [id: number]: {answered: boolean, correct: boolean};
};

export const Exercise: FunctionComponent = ({ children }) => {
    const [answers, setAnswers] = React.useState<AnswersStateType[]>([]);
    const [answerIdCallbacks, setAnswerIdCallbacks] = React.useState<AnswerIdCallbackType[]>([]);
    const registerHandler = (answerIdCallback: AnswerIdCallbackType) => {
        setAnswerIdCallbacks(answerIdCallbacks => [...answerIdCallbacks, answerIdCallback]);
    };

    useEffect(() => {
        answerIdCallbacks.forEach((callback, index) => {
            callback(index);
        });
        setAnswers(answerIdCallbacks.map(() => ({answered: false, correct: false})));
    }, [answerIdCallbacks]);

    const submitHandler = (answerId: number, isCorrect: boolean, isAnswered: boolean) => {
        const newAnswerState = {answered: isAnswered, correct: isCorrect};
        setAnswers(answers => answers.map((a, i) => i === answerId ? newAnswerState : a));
    };
    const Feedback = ({answers}) => {
        let message = "";
        if (answers.length > 0 && answers.every(({answered}) => answered)) {
            const score = Object.entries(answers).reduce((acc, entry, index) => acc + (entry[1].correct ? 1 : 0), 0);
            const total = Object.keys(answers).length;
            message = `${score}/${total}`;
        } else {
            message = `Vul je antwoord in`;
        }
        return <p>{ message }</p>
    };  
    return (
        <>
        <Feedback answers={answers} />
        <AnswerContext.Provider value={{registerHandler: registerHandler, submitHandler: submitHandler}}>
            { children }
        </AnswerContext.Provider>
        </>
    );
};


interface ExerciseStepperProps {
    title?: string;
}

export const ExerciseStepper: FunctionComponent<ExerciseStepperProps> = ({ children, title = "Oefening" }) => {
    const steps = React.Children.toArray(children);

    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>({});

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
            ? // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            steps.findIndex((step, i) => !(i in completed))
            : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    const StyledPaper = styled(Paper)`
        padding: ${theme.spacing(2)}px;
        margin: ${theme.spacing(1)}px;
    `;
    
    const StyledStepper = styled(Stepper)`
        background-color: transparent;
    `;

    return (
        <>
        <h3>{ title }</h3>
        <StyledStepper nonLinear activeStep={activeStep}>
            {steps.map((step, index) => (
            <Step key={index}>
                <StepButton onClick={handleStep(index)} completed={completed[index]} />
            </Step>
            ))}
        </StyledStepper>
        <StyledPaper elevation={1}>
            {steps[activeStep]}
        </StyledPaper>
        <Grid container>
            <Grid item>
                <Button disabled={activeStep === 0} onClick={handleBack} >
                    Vorige
                </Button>
            </Grid>
            <Grid item>
                <Button variant="contained"
                    color="primary"
                    onClick={handleNext}>
                    { activeStep === steps.length - 1 ? 'Klaar' : 'Volgende'}
                </Button>
            </Grid>
        </Grid>
        </>
    );
}
