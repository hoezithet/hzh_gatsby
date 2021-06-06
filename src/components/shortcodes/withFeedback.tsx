import React from "react";

import { useStore, StoreContext, StoreContextType } from '../store';
import { AnswerFeedback } from './answerFeedback';
import Button from '@material-ui/core/Button';


type WithFeedbackProps = {
    solution: React.ReactNode,
    explanation?: React.ReactNode,
    correct: boolean,
    children: React.ReactNode
};

export const withFeedback = <P extends object, T>(Component: React.ComponentType<P>): React.FC<P & WithFeedbackProps> => {
    return (props: WithFeedbackProps) => {
        const [answer, setAnswer, usingContext] = useStore<AnswerType<T>>();
        const showFeedback = answer?.showingSolution;
    
        const { registerElement, setElement, getElement } = {
            registerElement: idCallback => idCallback(-1),
            setElement: (_id, ans) => setAnswer(ans),
            getElement: _id => answer,
        } as StoreContextType<AnswerType<T>>;

        return (
            <StoreContext.Provider
                value={{ registerElement: registerElement, setElement: setElement, getElement: getElement }}
            >
                <Component {...(props as P)} />
                {showFeedback ? (
                    <AnswerFeedback
                        solution={answer?.solution}
                        explanation={answer?.explanation}
                        correct={answer?.correct}
                    />
                ) : null}
                {!usingContext && !showFeedback ? (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!(answer && answer.answered)}
                        onClick={() => answer ? setAnswer({ ...answer, showingSolution: true }) : null}
                    >
                        {"Toon feedback"}
                    </Button>
                ) : null}
            </StoreContext.Provider>
        );
    };
};