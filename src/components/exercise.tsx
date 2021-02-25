import React, { useContext, FunctionComponent, useState, useEffect, useCallback } from 'react';
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
import SwipeableViews from 'react-swipeable-views';

import { theme } from "./theme";

const StyledPaper = styled(Paper)`
    padding: ${theme.spacing(2)}px;
    margin: ${theme.spacing(1)}px;
`;

const StyledStepper = styled(Stepper)`
    background-color: transparent;
`;

interface AnswerContextType {
    registerHandler?: (answerIdCallback: AnswerIdCallbackType) => void;
    submitHandler?: (id: number, isCorrect: boolean, isAnswered: boolean) => void;
}

const StoreContext = React.createContext([]);

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
    const [registerAnswer, setAnswer, getAnswer] = useContext(StoreContext);
    
    useEffect(() => {
        registerAnswer((assignedId) => setAnswerId(assignedId));
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
        )
    };
    
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
    
    const getAnswerValue = () => {
        const answer = getAnswer(answerId);
        if (answer && answer.value !== undefined) {
            return answer.value;
        } else {
            return [];
        }
    };
    
    const setAnswerValue = (newValue) => {
        setAnswer({
            value: newValue,
            correct: evaluateAnswers(newValue),
            answered: newValue.length > 0
        }, answerId);
    };

    const handleChange = e => {
        if (!isNumeric(String(e.target.value))) {
            if (answerType === FILL_IN) {
                setAnswerValue([]);
            }
            return;
        }
        const val = Number(e.target.value);
        if (answerType === MULTIPLE_ANSWER) {
            if (e.target.checked) {
                setAnswerValue([...getAnswerValue(), val]);
            } else {
                setAnswerValue([...getAnswerValue().filter(ans => ans !== val)]);
            }
        } else {
            setAnswerValue([val]);
        }
    };
   
    switch (answerType) {
        case FILL_IN: {
            const valueType = typeof(correctAnswers[0]);
            return (
                <TextField variant="filled" type={ valueType } onChange={ handleChange } placeholder="Vul in"/>
            );
        }
        case MULTIPLE_CHOICE: {
            return (
                <RadioGroup value={getAnswerValue().length > 0 ? getAnswerValue()[0] : null} onChange={handleChange}>
                    {
                    options.map((option, index) => (
                    <FormControlLabel key={index} value={index} control={<Radio />} label={ option }/>
                    ))
                    }
                </RadioGroup>
            );
        }
        case MULTIPLE_ANSWER: {
            return (
                <FormGroup>
                    {
                    options.map((option, index) => (
                    <FormControlLabel
                        key={index} 
                        control={<Checkbox value={index} checked={ getAnswerValue().includes(index) } onChange={handleChange}/>}
                        label={ option } />
                    ))
                    }
                </FormGroup>
            );
        }
    }
};


type AnswerValueType = Array<number|string>;
type AnswerType = {
    value: AnswerValueType,
    correct: boolean,
    answered: boolean
}; 

const Feedback = ({answers}) => {
    let message = "";

    if (Array.isArray(answers) && answers.length > 0 && answers.every(({answered}) => answered)) {
        const score = answers.reduce((acc, {correct}, index) => acc + (correct ? 1 : 0), 0);
        const total = answers.length;
        message = `${score}/${total}`;
    } else {
        message = `Vul je antwoord in`;
    }
    return <p>{ message }</p>
};

export const Exercise: FunctionComponent = ({ children }) => {
    const [registerExercise, setStoredExercise, getStoredExercise] = useContext(StoreContext);
    const [exerciseId, setExerciseId] = useState(-1);
    const [exercise, setExercise] = useState({});
    
    useEffect(() => {
        registerExercise((id) => {
            setExerciseId(id);
        });
    }, []);

    const registerExerciseAnswer = (idCallback) => {
        setExercise(exercise => {
            const answers = exercise.answers ? exercise.answers : [];
            const answerId = answers.length;
            exercise.answers = [...answers, {}];
            idCallback(answerId);
            return exercise;
        });
    };
    
    useEffect(() => {
        setStoredExercise(exercise, exerciseId);
    }, [exercise]);
    
    const setExerciseAnswer = (answer, id) => {
        if (!Array.isArray(exercise.answers)) {
           return;
        }
        setExercise(exercise => {
            const newExercise = {...exercise};
            newExercise.answers[id] = {...answer};
            return newExercise;
        });
    };
    
    const getExerciseAnswer = (id) => {
        return exercise.answers
        ?
        exercise.answers[id]
        :
        null;
    };
    
    return (
        <StoreContext.Provider value={[registerExerciseAnswer, setExerciseAnswer, getExerciseAnswer]}>
        <Feedback answers={exercise.answers} />
        { children }
        </StoreContext.Provider>
    );
};

const Store: FunctionComponent = ({ children, onChange }) => {
    const [elements, setElements] = useState([]);
    const [idCallbacks, setIdCallbacks] = useState([]);

    const registerElement = (idCallback) => {
        setIdCallbacks(idCallbacks => {
            idCallback(idCallbacks.length);
            const newCallbacks = [...idCallbacks, idCallback];
            const elements = newCallbacks.map(() => ({}));
            setElements(elements);
            return newCallbacks;
        });
    };

    const setElement = (element, id) => {
        setElements(elements => {
            if (id < 0 || id >= elements.length) {
                return elements;
            }
            const newElements = [...elements];
            newElements[id] = element;
            return newElements;
        });
    };
    
    const getElement = (id) => {
        if (id === -1 || id >= elements.length) {
            return null;
        }
        return elements[id];
    };
    
    useEffect(() => onChange(elements), [elements]);
    
    return (
        <StoreContext.Provider value={[registerElement, setElement, getElement]}>
        { children }
        </StoreContext.Provider>
    );
}

type ExerciseType = {
    answers: AnswerType[]
};

interface ExerciseStepperProps {
    title?: string;
}

export const ExerciseStepper: FunctionComponent<ExerciseStepperProps> = ({ children, title = "Oefening" }) => {
    const steps = React.Children.toArray(children);
    const [exercises, setExercises] = useState<ExerciseType[]>([]);
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

    const totalSteps = () => {
        return steps.length;
    };
    
    useEffect(() => {
        setCompleted(exercises.reduce((acc, ex, index) => ({...acc, [index]: ex.answers ? ex.answers.every(a => a.answered) : false}), {}));
    }, [exercises]);

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return Object.values(completed).every(isComplete => isComplete);
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
            ? // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            parseInt(Object.entries(completed).filter((k, isComplete) => !isComplete)[0][0])
            : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };
    
    const handleStepChange = (step: number) => {
        handleStep(Math.min(step, exercises.length))();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };
    
    const handleExercisesChange = (exercises) => {
        setExercises(exercises);
    };

    return (
        <Store onChange={handleExercisesChange} >
        <h3>{ title }</h3>
        <Feedback answers={exercises.reduce((acc, ex) => [...acc, ...(ex.answers ? Object.values(ex.answers) : [])], [])} />
        <StyledStepper nonLinear activeStep={activeStep}>
            {steps.map((step, index) => (
            <Step key={index}>
                <StepButton onClick={handleStep(index)} completed={completed[index]} />
            </Step>
            ))}
        </StyledStepper>
        <SwipeableViews index={activeStep} onChangeIndex={handleStepChange}>
            {
              steps.map((step, index) =>
                  <StyledPaper key={index} elevation={1}>
                  { step }
                  <Grid container spacing={2}>
                      <Grid item>
                          <Button disabled={activeStep === 0} onClick={handleBack} >
                              Vorige
                          </Button>
                      </Grid>
                      <Grid item>
                          <Button variant="contained"
                              color="primary"
                              onClick={handleNext}>
                              { activeStep === steps.length - 1 && allStepsCompleted() ? 'Klaar' : 'Volgende'}
                          </Button>
                      </Grid>
                  </Grid> 
                  </StyledPaper>
              )
            }
        </SwipeableViews>
        </Store>
    );
}
