import React, { createContext, useContext, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'

import { useStoredElement, Store, GetNextElementsType } from '../store';
import { AnswerType, useAnswers } from "./answer";
import { ExerciseStepperContext } from './exerciseStepper';
import { ExercisesFeedback } from "./exerciseFeedback";
import { ExVarsType, getExVarsProxy } from "./exerciseVar";
import Paper from '../paper';

import { RootState } from '../../state/store'
import { exerciseAdded, exerciseAnswerAdded, removeExercise } from '../../state/exercisesSlice';
import { answerChanged, showAnswerSolution, resetAnswer } from '../../state/answersSlice'


export type ExerciseType = {
    id: string,
    answerIds: string[],
    showingSolution: boolean,
    rank: number
}

type ExerciseProps = {
	children: React.ReactNode,
	showTitle: boolean,
	vars: ExVarsType,
}

export type ExerciseContextValueType = {
    addAnswer: ((answerId: string) => void),
    vars: ExVarsType,
}

export const ExerciseContext = createContext<ExerciseContextValueType>({
    addAnswer: () => {},
    vars: {},
});

export const useExercises = () => {
    return useSelector(
        (state: RootState) => {
            return state.exercises;
        }
    )
};

export const useExercise = (id: string) => {
    return useExercises()?.find(ex => ex.id === id);
};

export const useExerciseAnswers = (exerciseId: string) => {
    const exercise = useExercise(exerciseId);
    const answers = useAnswers();
    return exercise?.answerIds.map(ansId =>
        answers?.find(ans => ans.id === ansId)
    );
};

/**
 * An exercise, consisting of one or more questions with answering modalities.
 *
 * The interactive parts of an exercise are provided by answering components like `MultipleChoice`,
 * `MultipleAnswer` and `FillString`. The user enters their response via the answering component and
 * can get feedback on their given answers. A simple exercise might look like this:
 *
 * ```jsx
 * <Exercise>
 *   2 + 5 is equal to
 *   <MultipleChoice shuffle={false} solution={1}>
 *
 *       - 4
 *       - 7
 *       - -5
 *
 *     <Explanation>
 *       If you'd be standing at number 2 on a number line and would take 5 steps to the right, you'll end up standing at number 7.
 *     </Explanation>
 *   </MultipleChoice>
 * </Exercise>
 * ```
 *
 * With **exercise variables**, it is possible to randomly generate certain parts of the exercise:
 *
 * ```jsx
 * import random from 'lodash/random';
 *
 * <Exercise vars={{
 *     a: random(1, 10),
 *     b: random(1, 10),
 *     aPlusB: ({a, b}) => a + b,
 *     aMinB: ({a, b}) => a - b,
 *     aTimesB: ({a, b}) => a * b,
 *  }}>
 *   <MdWithExVars>
 *     ${a} + ${b} is equal to
 *   </MdWithExVars>
 *   <MultipleChoice shuffle={false} solution={1}>
 *
 *       - <ExVar name="aMinB"/>
 *       - <ExVar name="aPlusB"/>
 *       - <ExVar name="aTimesB"/>
 *
 *     <Explanation>
 *       If you'd be standing at number <ExVar name="a"/> on a number line and would take <ExVar name="b"/> steps to the right,
 *       you'll end up standing at number <ExVar name="aPlusB"/>.
 *     </Explanation>
 *   </MultipleChoice>
 * </Exercise>
 * ```
 *
 * Note that you can pass in exercise variables that depend on other exercise
 * variables by using a callback. You can even pass in exercise variables that
 * depend on exercise variables that - in their turn - *also* depend on
 * exercise variables etc. As long as there or no circular dependencies,
 * everything will be sorted out nicely.
 *
 * Although the `ExVar` component offers an easy way to access the value of
 * exercise variables, there are circumstances where it is impossible to use
 * it. The most important example of such a circumstance is when you'd want to
 * use an exercise variable inside of a KaTeX formula. Luckily, the `Exercise`
 * component provides a workaround. More specifically, the `innerHTML` of all
 * child nodes with CSS classes `exVar` and `myExVar` (where `myExVar` can be
 * any of the keys passed to the `vars` prop of `Exercise`) will be replaced by
 * the value of the exercise variable with the name `myExVar`. Because we have
 * defined a global KaTeX macro `\\exVar` that injects the necessary CSS
 * classes, we can use our exercise variables in KaTeX as well! It goes like
 * this:
 *
 * ```jsx
 * <Exercise vars={{
 *     a: Math.floor(Math.random()*10),
 *     b: Math.floor(Math.random()*10),
 *     aPlusB: ({a, b}) => a + b,
 *     aMinB: ({a, b}) => a - b,
 *     aTimesB: ({a, b}) => a * b,
 *  }}>
 *
 *   $\exVar{a} + \exVar{b}$ is equal to
 *   <MultipleChoice shuffle={false} solution={1}>
 *
 *       - $\exVar{aMinB}$
 *       - $\exVar{aPlusB}$
 *       - $\exVar{aTimesB}$
 *
 *     <Explanation>
 *
 *       If you'd be standing at number $\exVar{a}$ on a number line and would take $\exVar{b}$ steps to the right,
 *       you'll end up standing at number $\exVar{aPlusB}$.
 *
 *     </Explanation>
 *   </MultipleChoice>
 *
 * </Exercise>
 * ```
 *
 * For more complex KaTeX formulas, however, the `\exVar` command is not ideal.
 * This is because the KaTeX rendering engine cannot take the dimensions of the
 * exercise variables into account and as such the layout will look ugly.
 * Instead, you better use the `MdWithExVars` component with which you can
 * write plain markdown syntax and embed exercise variables inside of it with
 * simple template literal syntax. For more details, check the `MdWithExVars`
 * docs.
 *
 * @prop {React.ReactNode} children The children of the exercise. Should contain some question text and one or more answer components.
 * @prop {boolean} showTitle If `true`, show a title above the exercise displaying the rank number of the exercise inside the current lesson.
 * @props {ExVarsType} vars The exercise variables.
 * ```
 */
export const Exercise = ({ children, showTitle=false, vars={} }: ExerciseProps) => {
    const id = useRef(nanoid());

    const exercise = useExercise(id.current);
    const answers = useExerciseAnswers(id.current);
    const nodeRef = useRef<HTMLDivElement>(null);
    const exVarsProxy = getExVarsProxy(vars);

    const addExerciseIdToStepper = useContext(ExerciseStepperContext);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            exerciseAdded({
                id: id.current,
            })
        )
        if (addExerciseIdToStepper !== null) {
            addExerciseIdToStepper(id.current)
        }
        return () =>  { removeExercise({ id: id.current }) };
    }, []);

    useEffect(() => {
        if (!nodeRef.current) {
            return;
        }

        Object.keys(vars).forEach(key => {
            const elements = nodeRef?.current?.querySelectorAll(`.exVar.${key}`);
            elements.forEach(el => {
                el.innerHTML = exVarsProxy[key];
            });
        });
    });

    const addAnswerId = (answerId: string) => {
        dispatch(
            exerciseAnswerAdded({
                exerciseId: id.current,
                answerId: answerId,
            })
        )
    }

    const allAnswered = (
        Array.isArray(answers) && answers.length > 0 && answers.every(ans => ans?.answered)
    );

    const allShowingSolutions = (
        Array.isArray(answers) && answers.length > 0 && answers.every(ans => ans?.showingSolution)
    );

    const showSolutions = () => {
        answers?.forEach(ans => {
            dispatch(
                showAnswerSolution({
                    id: ans?.id
                })
            )
        });
    };

    const handleReset = () => {
        answers?.forEach(ans => {
            dispatch(
                resetAnswer({
                    id: ans?.id
                })
            )
        });
    };

    const insideStepper = addExerciseIdToStepper !== null;
	const title = showTitle && exercise?.rank !== undefined ? <ExerciseTitle rank={exercise?.rank}/> : null;

    const ctxValRef = useRef<ExerciseContextValueType>({
        vars: exVarsProxy,
        addAnswer: addAnswerId,
    });
    return (
        <ExerciseContext.Provider value={ctxValRef.current}>
            <div ref={nodeRef}>
                {
                insideStepper ?
                <>
                { title }
                { children }
                </>
                :
                <Paper>
                    { title }
                    { children }
                    {
                    allShowingSolutions ?
                    <Button onClick={handleReset}>
                        { "Begin opnieuw" }
                    </Button>
                    : null
                    }
                    {
                    !allShowingSolutions ?
                    <Button variant="contained"
                        color="primary"
                        disabled={!allAnswered}
                        onClick={showSolutions} >
                        {"Toon feedback"}
                    </Button>
                    : null
                    }
                </Paper>
                }
            </div>
        </ExerciseContext.Provider>
    );
};

type ExerciseTitleProps = {
    rank: number,
}

const ExerciseTitle = ({ rank }: ExerciseTitleProps) => <h3>{ `Oefening ${(rank || 0) + 1} ` }</h3>;

export const TitledExercise = (props: ExerciseProps) => {
	return <Exercise {...props} showTitle={ true } />;
};
