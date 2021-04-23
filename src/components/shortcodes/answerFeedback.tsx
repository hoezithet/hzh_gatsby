import React, { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import styled from "styled-components";
import { gsap } from "gsap";

import { getRandomArrElement } from "../../utils/array";
import { theme } from "../theme";
import {
    AnswerValueType, AnswerOptionType, evaluateAnsweredOptions,
    getAnswerType, MULTIPLE_ANSWER, MULTIPLE_CHOICE
} from "./answer";


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

export const AnswerFeedbackContext = React.createContext<AnsFeedbackCtxType>(
    {
        options: [],
        answeredOptions: [],
        correctOptions: [],
        margin: 0,
        showFeedback: false
    }
);

type AnsFeedbackProps = {
    children?: React.ReactNode | null
};

export const AnswerFeedback = ({ children = null }: AnsFeedbackProps) => {
    const {
        options,
        answeredOptions,
        correctOptions,
        margin,
        showFeedback
    } = useContext(AnswerFeedbackContext);
    const answerType = getAnswerType(options, correctOptions);
    const isCorrect = evaluateAnsweredOptions(answeredOptions, correctOptions, margin);
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const answerToReadable = (
        [MULTIPLE_ANSWER, MULTIPLE_CHOICE].includes(answerType)
            ?
            (ans: AnswerOptionType) => ALPHABET[ans as number]
            :
            (ans: AnswerOptionType) => `${ans}`
    );
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
                    {isCorrect
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
                                {children}
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
