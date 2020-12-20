import React from "react";
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import COLORS from "../../colors";
import unified from 'unified';
import math from 'remark-math';
import remark from 'remark-parse';
import katex from 'rehype-katex';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';

const to_katex = unified()
    .use(remark)
    .use(math)
    .use(remark2rehype)
    .use(katex)
    .use(rehype2react, { createElement: React.createElement });

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
    & > div > p {
        margin: 0;
    }
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
        <TitleBox>
            { to_katex.processSync(title).result as JSX.Element }
        </TitleBox>
        <ContentBox>
            { children }
        </ContentBox>
    </Frame>
);

export { Attention };
