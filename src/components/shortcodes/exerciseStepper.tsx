import React, { useState, useCallback } from 'react';

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
import { ExerciseType } from "./exercise";
import { ExercisesFeedback } from "./exerciseFeedback";
import { Store, useStoredElement } from '../store';
import COLORS from '../../colors';
import { AnswerType } from './answer';


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

const getCircularReplacer = () => {
      const seen = new WeakSet();
    return (key, value) => {
            if (typeof value === "object" && value !== null) {
                      if (seen.has(value)) {
                                  return;
                                }
                      seen.add(value);
                    }
            return value;
          };
};


export const ExerciseStepper = ({ children }: ExerciseStepperProps) => {
    const steps = getExerciseStepsFromChildren(children);
    // const [exercises, setExercises, usingContext] = useStoredElement<ExerciseType[]>([]);
    const [exercises, setExercises] = React.useState<ExerciseType[]>([]);
    const usingContext = false;
    const [activeStep, setActiveStep] = useState(0);

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

    const handleStep = (step: number) => () => {
        if (isLastStep() && allStepsCompleted()) {
            // All exercises are done. The solution can be shown now.
            setExercises(
                exercises.map(ex => (
                    ex.map(ans =>
                        ({ ...ans, showingSolution: true })
                    )
                ))
            );
        }
        const newActiveStep =
            isLastStep() && !allStepsCompleted() && step > activeStep
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has not been completed
                (exercises.map((_ex, i) => i).find(i => !stepCompleted(i)) || step)
                : step;
        setActiveStep(newActiveStep % (allStepsCompleted() ? steps.length + 1 : steps.length));
    };

    const handleStepChange = (step: number) => {
        handleStep(step)();
    };

    const handleReset = () => {
        setExercises(exercises =>
            exercises.map(ex => 
                ex.map(_ans => ({} as AnswerType))
            )
        );
        setActiveStep(0);
    };

    const showFeedback = useCallback(() => {
        return exercises.every(ex => Array.isArray(ex) ? ex.every(ans => ans?.showingSolution) : false);
    }, [exercises]);

    const stepCompleted = useCallback((step: number) => {
        if (exercises && Array.isArray(exercises[step])) {
            console.log(JSON.stringify(exercises[step], getCircularReplacer()));
            return exercises[step].every(a => a.answered);
        } else {
            return false;
        }
    }, [exercises]);

    const allStepsCompleted = useCallback(() => {
        return exercises.every((_ex, index) => stepCompleted(index));
    }, [exercises]);

    const stepCorrect = useCallback((step: number) => {
        return  Array.isArray(exercises[step]) ? exercises[step].every(a => a.correct) : false;
    }, [exercises]);

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
                            disabled={!stepCompleted(index) && exercises.filter((_ex, i) => i !== index).every((_ex, i) => stepCompleted(i))}
                            onClick={handleNext}>
                            {index === steps.length - 1 && allStepsCompleted() ? 'Klaar' : 'Volgende'}
                        </Button>
                    </Grid>
                </NextPrevBtnGrid>
            </StyledPaper>
        )
    );
    
    if(showFeedback()) {
        views.push(
            <StyledPaper key={views.length} >
                <ExercisesFeedback nCorrect={exercises.reduce((acc, _ex, idx) => stepCorrect(idx) ? acc + 1 : acc, 0)} nTotal={exercises.length} />
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
    
    const setElements = (getNextExercises) => {
        console.log(`Calling setExercises with argument ${getNextExercises}`);
        setExercises(prevExercises => {
            console.log(`Calling getNextExercises...`);
            const nextExercises = getNextExercises(prevExercises);
            console.log(`Set new exercises of Stepper to ${JSON.stringify(nextExercises)} (usingContext ${usingContext})`);
            return nextExercises;
        });
    };

    return (
        <Store elements={exercises} setElements={setElements} name="stepperStore">
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
        </Store>
    );
}

export const BareExerciseStepper = ({ children }: ExerciseStepperProps) => {
    const [exercises, setExercises] = useStoredElement<ExerciseType[]>([]);
    return (
        <Store elements={exercises} setElements={setExercises} >
        {
            getExerciseStepsFromChildren(children).map((step, index) =>
                <StyledPaper key={index} elevation={1}>
                    {step}
                </StyledPaper>
            )
        }
        </Store>
    );
};
