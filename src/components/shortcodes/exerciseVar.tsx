import React, { useContext } from 'react'
import { ExerciseContext } from './exercise'

type ExVarPropsType = {
    name: string
}

export const ExVar = ({ name }: ExVarPropsType) => {
    const exCtx = useContext(ExerciseContext);
    if (exCtx?.vars && exCtx.vars[name] !== undefined) {
        return <span>{ exCtx.vars[name] }</span>;
    } else {
        return null;
    }
};

export type ExVarsType = { [key: string]: any; };

/**
 * Return a proxy of the exercise variables that will sort out the values of the exercise variables
 * that are defined as a callback (taking some of the other exercise variables as an argument).
 */
export const getExVarsProxy = (exVars: ExVarsType) => {
    return new Proxy(exVars, {
        get: function(target, property, receiver) {
            const propVal = Reflect.get(...arguments);
            if (propVal instanceof Function) {
                return propVal(receiver);
            } else {
                return propVal;
            }
        }
    });
};