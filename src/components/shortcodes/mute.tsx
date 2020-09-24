import React from "react";
import COLORS from "../../colors";
import styled from 'styled-components';

interface MuteProps {
    text: string;
}

const MuteSpan = styled.span`
    color: ${COLORS.GRAY};
`

const Mute = ({ text }: MuteProps) => (
    <MuteSpan>
        {text}
    </MuteSpan>
);

export { Mute };
