import React from "react";
import COLORS from "../../colors";
import styled from 'styled-components';
import md2react from "../../utils/md2react";

interface MuteProps {
    text: string;
}

const MuteSpan = styled.span`
    color: ${COLORS.GRAY};
    & > div {
        display: inline;
    }
    & > div > p {
        display: inline;
    }
`;

const Mute = ({ text }: MuteProps) => (
    <MuteSpan>
        {md2react(text)}
    </MuteSpan>
);

export { Mute };
