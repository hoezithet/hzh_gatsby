import React from "react";
import styled from 'styled-components';
import COLORS from '../colors';
import Box from '@material-ui/core/Box';

const TocTitle = styled.p`
    font-weight: bold;
`

const TocFrame = styled(Box)`
    margin: 20px 0px;
    color: ${COLORS.GRAY};
`

const TocLink = styled.a`
    text-decoration: none;
    color: ${COLORS.GRAY};
`

interface TocItems {
    children: { items: {url: string; title: string}[] };
}

const Toc = ({ children }: TocItems) => (
    <TocFrame>
        <TocTitle>
            Inhoud
        </TocTitle>
        <ul>{ children.items.map((item) => <li key={ item.title }><TocLink href={item.url}>{item.title}</TocLink></li>) }</ul>
    </TocFrame>
);

export default Toc ;
