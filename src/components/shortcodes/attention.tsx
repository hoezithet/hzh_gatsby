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
}

const Attention = ({ children }: AttentionProps) => (
    <Frame>
        <TitleBox>
            { /* Get title from first child
               * We can't use a separate property (e.g. "title") for the title,
               * because then its markdown syntax will not be rendered */}
            <div>{ children[0].props.children }</div>
        </TitleBox>
        <ContentBox>
            { children.slice(1) }
        </ContentBox>
    </Frame>
);

export { Attention };
