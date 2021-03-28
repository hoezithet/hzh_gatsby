import React, { useContext, FunctionComponent, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
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
import Collapse from '@material-ui/core/Collapse';
import styled from "styled-components";
import SwipeableViews from 'react-swipeable-views';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import COLORS from '../colors';
import { gsap } from "gsap";


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

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomArrElement(arr) {
  return arr[getRandomInt(arr.length)];
}

function isNumeric(str: string) {
    if (typeof str != "string") return false // we only process strings!
    str = str.replace(",", ".");
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
} 

const getAnswerType = (options, correctOptions) => (options.length === 0) ? FILL_IN : (correctOptions.length == 1) ? MULTIPLE_CHOICE : MULTIPLE_ANSWER;
const optEqual = (opt1: AnswerElementType, opt2: AnswerElementType, margin: number) => {
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

const evaluateAnsweredOptions = (answeredOptions: AnswerValueType, correctOptions: AnswerValueType, margin: number) => {
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

const FeedbackPaper = styled(Paper)`
    padding: ${theme.spacing(1)}px;
    margin-top: ${theme.spacing(1)}px;
    margin-bottom: ${theme.spacing(2)}px;
`;

type AnsFeedbackCtxType = {
    options: AnswerValueType,
    answeredOptions: AnswerValueType,
    correctOptions: AnswerValueType,
    margin: number,
    showFeedback: boolean
};

const AnsFeedbackCtx = React.createContext<AnsFeedbackCtxType>(
    {
        options: [],
        answeredOptions: [],
        correctOptions: [],
        margin: 0,
        showFeedback: false
    }
);

type AnsFeedbackProps = {
    children: React.ReactNode|null
};

export const AnswerFeedback = ({children = null}: AnsFeedbackProps) => {
    const {
        options,
        answeredOptions,
        correctOptions,
        margin,
        showFeedback
    } = useContext(AnsFeedbackCtx);
    const answerType = getAnswerType(options, correctOptions);
    const isCorrect = evaluateAnsweredOptions(answeredOptions, correctOptions, margin);
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const answerToReadable = answerType === FILL_IN ? (ans: number) => ans : (ans: number) => ALPHABET[ans];
    const readableAnswers = correctOptions.map(answerToReadable);
    const correctOptionsText = (
        readableAnswers.length > 1
        ?
        `${readableAnswers.slice(0, -1).join(',')} en ${readableAnswers.slice(-1)[0]}`
        :
        readableAnswers[0]
    );

    const correctMessages = [
        "Juist!",
        "Klopt!",
        "Correct!",
        "Helemaal goed!"
    ];
    
    const correctEmojis = [
        "🎉", "🎈", "🎊", "🥳", "👍", "💪", "👏",
        "🕺", "💃"
    ];
    
    const incorrectMessages = [
        "Niet juist...",
        "Dat klopt niet helaas...",
        "Jammer, dat is niet correct...",
        "Dat is helaas niet het juiste antwoord..."
    ];
    
    const incorrectEmojis = [
        "😕", "😩", "🤷", "🤷‍♂️", "🤷‍♀️"
    ];
    
    const correctFeedbackText = useMemo(
        () => `${getRandomArrElement(correctMessages)} ${getRandomArrElement(correctEmojis)}`,
        []);
    const incorrectFeedbackText = useMemo(
        () => (correctOptions.length > 1
        ?
        `${getRandomArrElement(incorrectMessages)} ${getRandomArrElement(incorrectEmojis)} De juiste antwoorden waren ${correctOptionsText}.`
        :
        `${getRandomArrElement(incorrectMessages)} ${getRandomArrElement(incorrectEmojis)} Het juiste antwoord was ${correctOptionsText}.`),
        []);
    
    const [showExtraExplanation, setShowExtraExplanation] = useState(false);
    const nodeHeight = useRef(0);
    const nodeRef = useRef(null);
    const extraExplnRef = useCallback(node => {
      if (node !== null) {
          nodeRef.current = node;
          nodeHeight.current = node.clientHeight;
          gsap.set(node, {
              height: 0,
              opacity: 0,
          });
      }
    }, []);
    
    useEffect(() => {
        const explnNode = nodeRef.current;
        if (explnNode === null) {
            return;
        }
        gsap.to(explnNode, {
            height: showExtraExplanation ? `${nodeHeight.current}px` : 0,
            opacity: showExtraExplanation ? 1 : 0,
            duration: 0.5,
            ease: "power2.inOut"
        });
    }, [showExtraExplanation]);
    
    return (
        showFeedback
        ?
        <FeedbackPaper elevation={0} variant="outlined">
            <b>
                { isCorrect
                ?
                correctFeedbackText
                :
                incorrectFeedbackText
                }
            </b>
            {
              children
              ?
              <>
              <div ref={extraExplnRef}>
                  { children }
              </div>
              <Button onClick={() => setShowExtraExplanation(prev => !prev)}>{
                  showExtraExplanation
                  ?
                  "Verberg meer uitleg"
                  :
                  "Toon meer uitleg"
              }</Button>
              </>
              :
              null
            }
        </FeedbackPaper>
        :
        null
    );
}

export const Answer: FunctionComponent<AnswerProps> = ({ children, correct, margin = 0.01 }) => {
    let feedback = null;
    let options = [];
    if (children) {
        const childArray = React.Children.toArray(children);
        feedback = childArray.find(c => c.props && c.props.mdxType === "AnswerFeedback");
        const optionsUl = childArray.find(c => c.props && c.props.originalType === "ul");
        if (optionsUl && optionsUl.props) {
            options = optionsUl.props.children.map(c => c.props.children);
        }
    }
    feedback = feedback || <AnswerFeedback/>;

    const correctOptions = Array.isArray(correct) ? correct : [correct];
    const answerType = getAnswerType(options, correctOptions);

    const [answerId, setAnswerId] = useState(-1);
    const [registerAnswer, setAnswer, getAnswer, allAnswers] = useContext(StoreContext);

    useEffect(() => {
        registerAnswer((assignedId) => setAnswerId(assignedId));
    }, []);

    const getChildrenArray = (children) => {
        const childArr = React.Children.toArray(children);
        if (childArr.length === 1) {
            return getChildrenArray(childArr[0]);
        } else {
            return childArr;
        }
    };

    const getCurrentAnswer = useCallback(() => {
        return getAnswer(answerId);
    }, [getAnswer, answerId]);


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

    const isCorrect = () => {
        const currentAnswer = getCurrentAnswer();
        if (currentAnswer && currentAnswer.showFeedback !== undefined) {
            return currentAnswer.showFeedback;
        } else {
            return false;
        }
    };

    const setAnsweredOption = useCallback((newValue: AnswerValueType) => {
        setAnswer({
            value: newValue,
            correct: evaluateAnsweredOptions(newValue, correctOptions, margin),
            answered: newValue.length > 0,
            showFeedback: false
        }, answerId);
    }, [setAnswer]);

    const handleChange = e => {
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
                const valueType = typeof(correctOptions[0]);
                const filledValue = ansValue.length > 0 ? ansValue[0] : null;
                return (
                    <TextField disabled={showFeedback()} variant="filled" onChange={ handleChange }
                    placeholder={showFeedback() ? filledValue : "Vul in"} value={filledValue} />
                );
            }
            case MULTIPLE_CHOICE: {
                const chosenIdx = ansValue.length > 0 ? ansValue[0] : null;
                return (
                    <RadioGroup value={chosenIdx} onChange={handleChange}>
                        {
                        options.map((option, index) => (
                        <FormControlLabel key={index} value={index} control={<Radio />} label={ option } disabled={showFeedback()}/>
                        ))
                        }
                    </RadioGroup>
                );
            }
            case MULTIPLE_ANSWER: {
                return (
                    <FormGroup>
                        {
                        options.map((option: AnswerElementType, index: number) => (
                        <FormControlLabel
                            key={index} 
                            control={<Checkbox value={index} checked={ getAnswerValue().includes(index) } onChange={handleChange}/>}
                            label={ option }
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
        <AnsFeedbackCtx.Provider value={ctxValue}>
            { answerComp }
            { feedback }
        </AnsFeedbackCtx.Provider>
    );
};


type AnswerElementType = number|string;
type AnswerValueType = Array<AnswerElementType>;
type AnswerType = {
    value: AnswerValueType,
    correct: boolean,
    answered: boolean,
    showFeedback: boolean
}; 

type ExercisesFeedbackProps = {
    nCorrect: number,
    nTotal: number
};

const ExercisesFeedbackDiv = styled.div`
    text-align: center;
    margin: ${theme.spacing(2)}px;
`;

const ExercisesFeedbackImg = styled.img`
    border-radius: ${theme.spacing(1)}px;
`;

const ExercisesFeedback = ({nCorrect, nTotal}: ExercisesFeedbackProps) => {
    const [imgSrc, setImgSrc] = useState(null);
    const [query, message] = useMemo(() => {
        let query, message;
        const pct = nCorrect / nTotal;
        if (pct === 1.0) {
            query = getRandomArrElement(["party", "excited", "dance", "hooray", "proud"]);
            message = getRandomArrElement(["Proficiat!", "Mooi zo!", "Perfect!", "Hoera! Alles juist!", "Super goed!"]);
            const partyEmojis = [
                "🎉", "🎈", "🎊", "🥳", "👏", "🕺", "💃"
            ];
            const emoji1 = getRandomArrElement(partyEmojis);
            const emoji2 = getRandomArrElement(partyEmojis.filter(e => e !== emoji1));
            message = `${emoji1}${emoji2} ${message} ${emoji2}${emoji1}`
        } else if (pct >= 0.6) {
            query = getRandomArrElement(["good job", "well done"]);
            message = getRandomArrElement(["Zeker niet slecht!", "Kan ermee door!"]);
        } else {
            query = getRandomArrElement(["darn"]);
            message = getRandomArrElement(["Helaas toch enkele foutjes...", "Jammer!", "Volgende keer beter!"]);
        }
        return [query, message];
    }, []);
    useEffect(() => {
        const offset = Math.floor(Math.random() * Math.floor(20));
        const url = `${process.env.GATSBY_GIPHY_API_URL}?api_key=${process.env.GATSBY_GIPHY_API_KEY}&q=${query}&limit=1&offset=${offset}&rating=g&lang=en`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
              if (!(data && data.data && data.data[0] && data.data[0].images)) {
                  return;
              }
              const giphyImg = data.data[0].images.fixed_width;
              setImgSrc(giphyImg.url);
          });
    }, []);
    return (
        <ExercisesFeedbackDiv>
            <p>Je behaalde:</p>
            <h3>{ `${nCorrect}/${nTotal}` }</h3>
            <p>{ message }</p>
            {
                imgSrc
                ?
                <ExercisesFeedbackImg src={imgSrc}/>
                :
                null
            }
        </ExercisesFeedbackDiv>
    );
};

export const Exercise: FunctionComponent = ({ children }) => {
    const [registerExercise, setStoredExercise, getStoredExercise, allExercises] = useContext(StoreContext);
    const [exerciseId, setExerciseId] = useState(-1);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        registerExercise((id) => {
            setExerciseId(id);
        });
    }, []);

    const registerExerciseAnswer = useCallback((idCallback) => {
        setAnswers(answers => {
            const answerId = answers.length;
            idCallback(answerId);
            const newAnswers = [...answers, {}];
            setStoredExercise({answers: newAnswers}, exerciseId);
            return newAnswers;
        });
    }, [setAnswers]);

    useEffect(() => {
        const exercise = getStoredExercise(exerciseId);
        if (exercise && exercise.answers) {
            setAnswers(exercise.answers);
        }
    }, [allExercises]);

    const setExerciseAnswer = useCallback((answer, id) => {
        setAnswers(answers => {
            answers[id] = {...answer};
            setStoredExercise({answers: answers}, exerciseId);
            return answers;
        });
    }, [answers, setAnswers]);

    const getExerciseAnswer = useCallback((id) => {
        return answers.length > id
        ?
        answers[id]
        :
        null;
    }, [answers]);

    return (
        <>
        <StoreContext.Provider value={[registerExerciseAnswer, setExerciseAnswer, getExerciseAnswer, answers]}>
        { children }
        </StoreContext.Provider>
        </>
    );
};

const Store: FunctionComponent = ({ children, elements, setElements }) => {
    const [idCallbacks, setIdCallbacks] = useState([]);

    const registerElement = useCallback((idCallback) => {
        setIdCallbacks(idCallbacks => {
            idCallback(idCallbacks.length);
            const newCallbacks = [...idCallbacks, idCallback];
            const elements = newCallbacks.map(() => ({}));
            setElements(elements);
            return newCallbacks;
        });
    }, [elements, setElements]);

    const setElement = useCallback((element, id) => {
        setElements(elements => {
            if (id < 0 || id >= elements.length) {
                return elements;
            }
            const newElements = [...elements];
            newElements[id] = element;
            return newElements;
        });
    }, [elements, setElements]);

    const getElement = useCallback((id) => {
        if (id === -1 || id >= elements.length) {
            return null;
        }
        return elements[id];
    }, [elements]);

    return (
        <StoreContext.Provider value={[registerElement, setElement, getElement, elements]}>
        { children }
        </StoreContext.Provider>
    );
};

function ExerciseStepIcon(props: StepIconProps) {
  const { active, completed, correct, showFeedback } = props;
  const Icon = completed ? RadioButtonCheckedIcon : RadioButtonUncheckedIcon;

  const StyledIcon = styled(Icon)`
      color: ${showFeedback ? (correct ? COLORS.GREEN : COLORS.ORANGE) : (active ? COLORS.GOLD : COLORS.LIGHT_GRAY)};
      opacity: ${active ? "100%" : "50%"};
  `;

  return (
      <StyledIcon />
  );
}

type ExerciseType = {
    answers: AnswerType[]
};

interface ExerciseStepperProps {
    title?: string;
}

const NextPrevBtnGrid = styled(Grid)`
    margin-top: ${theme.spacing(1)}px;
`

export const ExerciseStepper: FunctionComponent<ExerciseStepperProps> = ({ children, title = "Oefening" }) => {
    const steps = React.Children.toArray(children);
    const [exercises, setExercises] = useState<ExerciseType[]>([]);
    const [activeStep, setActiveStep] = useState(0);

    const totalSteps = () => {
        return steps.length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const handleNext = () => {
        handleStepChange(activeStep + 1);
        if (isLastStep() && allStepsCompleted()) {
            // All exercises are done. Feedback can be shown now.
            setExercises(
                exercises.map(ex => (
                    {
                        answers: ex.answers.map(ans => (
                            {...ans, showFeedback: true}
                        ))
                    }
                ))
            );
        }
    };

    const handleBack = () => {
        handleStepChange(activeStep - 1);
    };

    const handleStep = (step: number) => () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted() && step > activeStep
            ? // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            exercises.map((ex, i) => i).find(i => !stepCompleted(i))
            : step;
        setActiveStep(newActiveStep % (allStepsCompleted() ? steps.length + 1 : steps.length));
    };

    const handleStepChange = (step: number) => {
        handleStep(step)();
    };

    const handleReset = () => {
        setActiveStep(0);
        setExercises(
            exercises.map(ex => (
                {
                    answers: ex.answers.map(ans => (
                        {}
                    ))
                }
            ))
        );
    };
    
    const showFeedback = useCallback(() => {
        return exercises.every(ex => ex.answers && ex.answers.every(ans => ans.showFeedback));
    }, [exercises]);

    const stepCompleted = useCallback((step: number) => {
        return (
            exercises[step] && Array.isArray(exercises[step].answers)
            ?
            exercises[step].answers.every(a => a.answered)
            :
            false
        );
    }, [exercises]);

    const allStepsCompleted = useCallback(() => {
        return exercises.every((ex, index) => stepCompleted(index));
    }, [exercises]);

    const stepCorrect = useCallback((step: number) => {
        return (
            exercises[step] && exercises[step].answers
            ?
            exercises[step].answers.every(a => a.correct)
            :
            false
        );
    }, [exercises]);

    return (
        <Store elements={exercises} setElements={setExercises} >
        <h3>{ title }</h3>
        <StyledStepper nonLinear activeStep={activeStep}>
            {steps.map((step, index) => (
                <Step key={index}>
                    <StepLabel
                     StepIconComponent={ExerciseStepIcon}
                     StepIconProps={
                         {
                             active: activeStep === index,
                             completed: stepCompleted(index),
                             correct: stepCorrect(index),
                             showFeedback: showFeedback()
                         }
                     }
                     onClick={handleStep(index)} />
                </Step>
            ))}
        </StyledStepper>
        <SwipeableViews index={activeStep} onChangeIndex={handleStepChange}>
            {
              steps.map((step, index) =>
                  <StyledPaper key={index} elevation={1}>
                  { step }
                  <NextPrevBtnGrid container spacing={2}>
                      <Grid item>
                          <Button disabled={activeStep === 0} onClick={handleBack} >
                              Vorige
                          </Button>
                      </Grid>
                      <Grid item>
                          <Button variant="contained"
                              color="primary"
                              disabled={!stepCompleted(index) && exercises.filter((ex, i) => i !== index).every((ex, i) => stepCompleted(i))}
                              onClick={handleNext}>
                              { index === steps.length - 1 && allStepsCompleted() ? 'Klaar' : 'Volgende'}
                          </Button>
                      </Grid>
                  </NextPrevBtnGrid>
                  </StyledPaper>
              )
            }
            {
              showFeedback()
              ?
              <StyledPaper>
                  <ExercisesFeedback nCorrect={exercises.reduce((acc, ex, idx) => stepCorrect(idx) ? acc + 1 : acc, 0)} nTotal={exercises.length}/>
                  <NextPrevBtnGrid container spacing={2}>
                      <Grid item>
                          <Button onClick={handleReset}>
                              Begin opnieuw
                          </Button>
                      </Grid>
                      <Grid item>
                          <Button variant="contained"
                              color="primary"
                              onClick={handleNext}>
                              Toon feedback
                          </Button>
                      </Grid> 
                  </NextPrevBtnGrid>  
              </StyledPaper>
              :
              null
            }
        </SwipeableViews>
        </Store>
    );
}
