import React, { useContext } from "react";

import { ExerciseContext } from './exercise'
import { AnswerType } from './answer';
import { VarsType } from "./exerciseVar";


type WithCallableSolutionProps = {
    children: React.ReactNode,
    solution: React.ReactNode|((VarsType) => React.ReactNode),
};

/**
 * HOC allowing to use exercise variables in answer solutions.
 * 
 * @param {React.ComponentType<P>} Component The component to wrap (probably an Answer-like component, e.g. MultipleChoice)
 */
const withCallableSolution = <P extends object>(Component: React.ComponentType<P>): React.FC<P & WithCallableSolutionProps> => {
    return (props: WithCallableSolutionProps) => {
        const exCtx = useContext(ExerciseContext);

        if (exCtx && props.solution instanceof Function) {
            props = {...props, solution: props.solution(exCtx.vars)};
        }
        return (
            <Component {...(props as P)} />
        );
    };
};

export default withCallableSolution;
