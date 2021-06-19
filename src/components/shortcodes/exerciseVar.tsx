import React, { useContext } from 'react'
import { ExerciseContext } from './exercise'

type VarType = {
    name: string
}

export const Var = ({ name }: VarType) => {
    const exCtx = useContext(ExerciseContext);
    if (exCtx?.vars && exCtx.vars[name] !== undefined) {
        return <span>{ exCtx.vars[name] }</span>;
    } else {
        return null;
    }
};
