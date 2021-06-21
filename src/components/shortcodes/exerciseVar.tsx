import React, { useContext } from 'react'
import { ExerciseContext } from './exercise'
import interpolate from '../../utils/stringInterpolate'
import md2react from '../../utils/md2react'

type ExVarPropsType = {
    name: string
}

export const ExVar = ({ name }: ExVarPropsType) => {
    const exCtx = useContext(ExerciseContext);
    if (exCtx?.vars && exCtx.vars[name] !== undefined) {
        return exCtx.vars[name];
    } else {
        return null;
    }
};

type MdWithExVarsPropsType = {
    children: string
}

/**
 * Render exercise variables inside of markdown text.
 *
 * To use an exercise variable, write its name like a placeholder inside of a
 * template literal, e.g. to use the value of an exercise variable called "a":
 *
 * ```md
 * The value of variable **a** is: ${a}
 * ```
 *
 * This is very handy when exercise variables occur inside a KaTeX formula.
 * They can easily be embedded like so:
 *
 * ```md
 * A formula with variables a and b:
 *
 * $$
 * a^2 + b^2 = ${a}^2 + ${b}^2
 * $$
 * ```
 *
 * @prop {string} children: The markdown text to render
 */
export const MdWithExVars = ({ children }: MdWithExVarsPropsType) => {
    const exCtx = useContext(ExerciseContext);
    if (exCtx?.vars) {
        return md2react(interpolate(children, exCtx.vars));
    } else {
        return null;
    }
};

export type ExVarsType = { [key: string]: any; };

/**
 * Return a proxy of the exercise variables that will sort out the values of
 * the exercise variables that are defined as a callback (taking some of the
 * other exercise variables as an argument).
 */
export const getExVarsProxy = (exVars: ExVarsType) => {
    return new Proxy(exVars, {
        get: function(target: ExVarsType, property: string, receiver) {
            const propVal = target[property];
            if (propVal instanceof Function) {
                return propVal(receiver);
            } else {
                return propVal;
            }
        }
    });
};
