import React from "react";
import styled from 'styled-components';
import COLORS from '../colors';
import Box from '@material-ui/core/Box';

const TocTitle = styled.p`
    font-weight: bold;
`

const TocFrame = styled(Box)`
    border-radius: 10px;
    border-style: solid;
    border-color: ${COLORS.GRAY};
    margin: 20px 0px;
`

interface TocItems {
    children: { items: [{url: string, title: string}] };
}

const Toc = ({ children }: TocItems) => (
    <TocFrame>
        <TocTitle>
            Inhoud
        </TocTitle>
        <ul>{ children.items.map((item) => <li><a href={item.url}>{item.title}</a></li>) }</ul>
    </TocFrame>
);

export default Toc ;
