import React from "react";


type ExplanationProps = {
    children: React.ReactNode
};

export const Explanation = ({ children }: ExplanationProps) => {
    return (
        <p>
        { children }
        </p>
    );
};