import React, { useContext, FunctionComponent, useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';

// Multiple choice and multiple answer exercises

// Invuloefeningen (kan ook met multiple choice dropdown)
// Foutenmarge bij invuloefening

// Oefeningen in de les zelf staan in een Card met een reeks van een of meerdere vragen weergegeven met een Stepper.
// Na het indienen van de volledige reeks, krijg je je score te zien samen met een knop "Toon oplossingen". De bolletjes van de stepper veranderen ook in vinkjes of kruisjes. Wanneer je op de knop "Toon oplossingen" klikt, spoelt de Stepper terug naar de eerste vraag en zie je welk antwoord je had gegeven en welk antwoord juist is. Onderaan komt een veld met uitleg hoe je tot de juiste oplossing kan komen.

// Op apart oefenblad (per les) staan oefeningen genummerd onder elkaar. De titel van een oefening bestaat uit de nummering, samen met een korte versie van de opdracht (bv. "Vul in" of "Los op"), of een indicatie waar de oefening over gaat (bv. "De omheining van boer Teun").
// Onder de oefening staat een knop "Controleer antwoord". Wanneer je hierop klikt, zie je of / welke antwoorden juist/fout waren. In een Card zie je hoe je tot de juiste oplossing kan komen.

// In bare lessen staan de oefeningen in de les zelf onder elkaar. Helemaal onderaan de pagina staan de uitwerkingen van elke oefening. Op de oefenbladen staan de oefeningen genummerd onder elkaar, gevolgd door de titel "Oplossingen" en de uitwerkingen per oefening.

// ! Vraag bestaat uit markdown tekst waarin op eender welke plek een antwoord-mogelijkheid kan voorkomen die in zekere mate mee de eindscore op die vraag bepaalt (bv. via weight-parameter die default overal op 1 staat). Hoe kan een Answer-component die tussen de markdown staat haar score communiceren met de ExerciseStepper-component?
// Context provider in ExerciseStepper met een lege array als value. Array wordt opgevuld door answers met eenvoudige objecten ({score: int, weight: int, answered: boolean}).
// "isCompleted" State in Exercise Stepper wordt berekend door combinatie van alle "answered" fields. De state van de icoontjes in de steps zijn een combinatie van isCompleted en de scores op de vragen die bij een bepaalde step hoorden (wordt uit context gehaald).


const AnswerContext = React.createContext([]);

interface AnswerProps {
    weight?: number;
    correct: number | string | number[];
    margin?: number | number[];
    isInline?: boolean;
}

const FILL_IN = "fill";
const MULTIPLE_CHOICE = "multiple choice";
const MULTIPLE_ANSWER = "multiple answer";

const Answer: FunctionComponent<AnswerProps> = ({ children, correct, margin = 0, isInline = false }) => {
    const correctAnswers = Array.isArray(correct) ? correct : [correct];
    const [answerValues, setAnswerValues] = useState([]);

    const ansEqual = (ans1, ans2) => {
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

    const evaluateAnswers = () => (
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
    );
    const answerCallbacks = useContext(AnswerContext);
    answerCallbacks.push(evaluateAnswer);

    const options = React.Children.toArray(children);
    const answerType = (options.length === 0) ? FILL_IN : (correctAnswers.length == 1) ? MULTIPLE_CHOICE : MULTIPLE_ANSWER;

    switch (answerType) {
        case FILL_IN:
            const valueType = typeof(correctAnswers[0]);
            const handleChange = e => setAnswerValues([e.target.value]);
            return (
                isInline
                ?
                <TextField variant="filled" type={ valueType } component={ span } size="small" onChange={ handleChange }/>
                :
                <TextField variant="filled" type={ valueType } onChange={ handleChange }/>
            );
        case MULTIPLE_CHOICE:
            const handleChange = e => setAnswerValues([e.target.value]);
            if (isInline) {
                const selectItems = [<MenuItem value={ -1 } disabled/>];
                selectItems.concat(options.map((option, index) =>
                    <MenuItem key={ index } value={ index }>{ option }</MenuItem>)
                );
                return (
                    <Select value={answerValues} onChange={handleChange}>
                        { selectItems }
                    </Select>
                );
            } else {
                return (
                    <RadioGroup value={answerValues} onChange={handleChange}>
                        {
                        options.map((option, index) => (
                        <FormControlLabel key={index} value={index} control={<Radio />} label={ option }/>
                        ))
                        }
                    </RadioGroup>
                );
            }
        case MULTIPLE_ANSWER:
            const handleChange = e => {
                const val = e.target.value;
                const checked = e.target.checked;
                if (answerValues.includes(val) && !checked) {
                    setAnswerValues(answerValues.filter(ans => ans !== val));
                } else if (!answerValues.includes(val) && checked) {
                    const newAnswerValues = answerValues.push(val);
                    setAnswerValues(newAnswerValues);
                }
            });
            return (
                <FormGroup>
                    {
                    options.map((option, index) => (
                    <FormControlLabel
                        control={<Checkbox checked={ answerValues.includes(index) } onChange={handleChange}/>}
                        label={ option } />
                    ))
                    }
                </FormGroup>
            );
    }
};

const Exercise = ({ children }) => {
    return (
        <AnswerContext.Provider value={[]}>
            { children }
        </AnswerContext.Provider>
    );
};

const ExerciseStepper = (props) => {
    const steps = React.Children.toArray(props.children);

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


    return (
        <AnswerContext.Provider value={[]}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((_, index) => (
                <Step key={index}>
                    <StepButton onClick={handleStep(index)} completed={completed[index]} />
                </Step>
                ))}
            </Stepper>
        </AnswerContext.Provider>
    );
}
