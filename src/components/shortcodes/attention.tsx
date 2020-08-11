import React from "react";
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import COLORS from "../../colors";

const Frame = styled(Box)`
    border-radius: 10px;
    border-style: solid;
    border-color: ${COLORS.GRAY};
    margin: 20px 0px;
`

const TitleBox = styled(Box)`
    background-color: ${COLORS.GRAY};
    color: ${COLORS.NEAR_WHITE};
    padding: 10px;
    font-size: 1.2rem;
    font-weight: bold;
`

const ContentBox = styled(Box)`
    padding: 20px;
`

interface AttentionProps {
    children: React.ReactNode;
    title: string;
}

const Attention = ({ children, title }: AttentionProps) => (
    <Frame>
        <TitleBox>{ title.toUpperCase() }</TitleBox>
        <ContentBox>
            { children }
        </ContentBox>
    </Frame>
);

export { Attention };
