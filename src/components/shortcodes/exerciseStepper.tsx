import React, { useState, useCallback, useRef, createContext, useEffect } from 'react';

import Step from '@material-ui/core/Step';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import Stepper from '@material-ui/core/Stepper';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import styled from "styled-components";
import SwipeableViews from 'react-swipeable-views';

import { theme } from "../theme";
import { ExerciseType, useExercises } from "./exercise";
import { ExercisesFeedback } from "./exerciseFeedback";
import { Store, useStoredElement } from '../store';
import COLORS from '../../colors';
import { AnswerType, useAnswers } from './answer';

import { RootState } from '../../state/store'
import { exerciseStepperAdded, exerciseStepAdded, removeExerciseStepper } from '../../state/exerciseSteppersSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { showAnswerSolution, resetAnswer } from '../../state/answersSlice'


interface ExerciseStepperProps {
    children: React.ReactNode;
}

const StyledPaper = styled(Paper)`
    padding: ${theme.spacing(2)}px;
    margin: ${theme.spacing(1)}px;
    break-inside: avoid;
`;

const StyledStepper = styled(Stepper)`
    background-color: transparent;
`;

const StyledStep = styled(Step)`
    cursor: pointer;
`;

const useStyles = makeStyles({
    icon: {
        color: (props: StepIconProps) =>
            props.active ? COLORS.GOLD : COLORS.LIGHT_GRAY,
        cursor: "pointer"
    }
});

function ExerciseStepIcon(props: StepIconProps) {
    const Icon = props.completed ? RadioButtonCheckedIcon : RadioButtonUncheckedIcon;

    return (
        <Icon color={props.active ? "primary" : "disabled"} />
    );
}

const NextPrevBtnGrid = styled(Grid)`
    margin-top: ${theme.spacing(1)}px;
`

const getExerciseStepsFromChildren = (children: React.ReactNode) => {
    return React.Children.toArray(children);
};

type ExerciseStepperContextValueType = ((exerciseId: string) => void);

export const ExerciseStepperContext = createContext<ExerciseStepperContextValueType|null>(null);

export const useExerciseSteppers = () => {
    return useSelector(
        (state: RootState) => state.exerciseSteppers
    );
};

export const useExerciseStepper = (id: string) => {
    return useExerciseSteppers().find(
        stepper => stepper.id === id
    )
};

export const useExerciseStepperExercises = (id: string) => {
    const exerciseStepper = useExerciseStepper(id);
    const allExercises = useExercises();
    return allExercises.filter(ex => exerciseStepper?.exerciseIds.includes(ex.id));
};

export const useExerciseStepperAnswers = (id: string) => {
    const exercises = useExerciseStepperExercises(id);
    const allAnswers = useAnswers();
    return exercises?.map(
        ex => ex?.answerIds.map(ansId =>
            allAnswers.find(ans => ansId === ans?.id)
        )
    );
};

export type ExerciseStepperType = {
    id: string,
    exerciseIds: string[],
}

export const ExerciseStepper = ({ children }: ExerciseStepperProps) => {
    const id = useRef(nanoid());
    const steps = getExerciseStepsFromChildren(children);

    const exerciseStepper = useExerciseStepper(id.current);
    const answers = useExerciseStepperAnswers(id.current);
    const flatAnswers = answers.reduce((acc, curVal) => acc?.concat(curVal), []);

    const dispatch = useDispatch();

    const [activeStep, setActiveStep] = useState(0);

    if (!exerciseStepper) {
        dispatch(
            exerciseStepperAdded({
                id: id.current,
                exerciseIds: [],
                nCorrect: 0,
            })
        )
    }

    useEffect(() => {
        return () => { removeExerciseStepper({ id: id.current }) };
    }, []);

    const addExerciseId = (exerciseId: string) => {
        dispatch(
            exerciseStepAdded({
                exerciseStepperId: id.current,
                exerciseId: exerciseId,
            })
        )
    }

    const totalSteps = () => {
        return steps.length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const handleNext = () => {
        handleStepChange(activeStep + 1);
    };

    const handleBack = () => {
        handleStepChange(activeStep - 1);
    };
    
    const showSolutions = () => {
        flatAnswers?.forEach(ans => {
            dispatch(
                showAnswerSolution({
                    id: ans?.id
                })
            )
        });
    };

    const handleStep = (step: number) => () => {
        if (isLastStep() && allStepsCompleted()) {
            // All exercises are done. The solution can be shown now.
            showSolutions();
        }
        const newActiveStep =
            isLastStep() && !allStepsCompleted() && step > activeStep
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has not been completed
                (answers?.map((_ans, i) => i).find(i => !stepCompleted(i)) || step)
                : step;
        setActiveStep(newActiveStep % (allStepsCompleted() ? steps.length + 1 : steps.length));
    };

    const handleStepChange = (step: number) => {
        handleStep(step)();
    };

    const handleReset = () => {
        flatAnswers?.forEach(ans => {
            dispatch(
                resetAnswer({
                    id: ans?.id
                })
            )
        });
        setActiveStep(0);
    };

    const isShowingSolutions = () => {
        return flatAnswers?.every(ans => ans?.showingSolution) || false
    };
    
    const getStepAnswers = (step: number) => {
        if (!Array.isArray(answers)) { return null }
        return answers[step];
    };
    
    const stepCompleted = (step: number) => {
        const stepAnswers = getStepAnswers(step);
        return stepAnswers?.every(a => a?.answered) || false;
    };

    const allStepsCompleted = () => {
        return answers?.every((_exAnswers, index) => stepCompleted(index));
    };

    const stepCorrect = (step: number) => {
        const stepAnswers = getStepAnswers(step);
        return  stepAnswers?.every(a => a?.correct) || false;
    };
    
    const getScore = () => {
        return answers?.reduce((acc, _exAnswers, idx) => stepCorrect(idx) ? acc + 1 : acc, 0) || 0;
    };

    const views = (
        steps.map((step, index) =>
            <StyledPaper key={index} elevation={1}>
                {step}
                <NextPrevBtnGrid container spacing={2}>
                    <Grid item>
                        <Button disabled={activeStep === 0} onClick={handleBack} >
                            { "Vorige" }
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained"
                            color="primary"
                            disabled={!stepCompleted(index) && answers?.filter((_exAns, i) => i !== index).every((_ex, i) => stepCompleted(i))}
                            onClick={handleNext}>
                            {index === steps.length - 1 && allStepsCompleted() ? 'Klaar' : 'Volgende'}
                        </Button>
                    </Grid>
                </NextPrevBtnGrid>
            </StyledPaper>
        )
    );
    
    if(isShowingSolutions()) {
        views.push(
            <StyledPaper key={views.length} >
                <ExercisesFeedback nCorrect={getScore()} nTotal={steps.length || 0} />
                <NextPrevBtnGrid container spacing={2}>
                    <Grid item>
                        <Button onClick={handleReset}>
                            { "Begin opnieuw" }
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained"
                            color="primary"
                            onClick={handleNext}>
                            { "Toon feedback" }
                        </Button>
                    </Grid>
                </NextPrevBtnGrid>
            </StyledPaper>
        );
    }

    return (
        <ExerciseStepperContext.Provider value={addExerciseId}>
            <StyledStepper nonLinear activeStep={activeStep}>
                {steps.map((_step, index) => (
                    <StyledStep key={index}>
                        <StepLabel
                            StepIconComponent={ExerciseStepIcon}
                            StepIconProps={
                                {
                                    active: activeStep === index,
                                    completed: stepCompleted(index),
                                }
                            }
                            onClick={handleStep(index)} />
                    </StyledStep>
                ))}
            </StyledStepper>
            <SwipeableViews index={activeStep} onChangeIndex={handleStepChange}>
                { views }
            </SwipeableViews>
        </ExerciseStepperContext.Provider>
    );
}

export const BareExerciseStepper = ({ children }: ExerciseStepperProps) => {
    const id = useRef(nanoid());
    const dispatch = useDispatch();
    const addExerciseId = (exerciseId: string) => {
        dispatch(
            exerciseStepAdded({
                exerciseStepperId: id.current,
                exerciseId: exerciseId,
            })
        )
    }
    return (
        <ExerciseStepperContext.Provider value={addExerciseId}>
        {
            getExerciseStepsFromChildren(children).map((step, index) =>
                <StyledPaper key={index} elevation={1}>
                    {step}
                </StyledPaper>
            )
        }
        </ExerciseStepperContext.Provider>
    );
};
