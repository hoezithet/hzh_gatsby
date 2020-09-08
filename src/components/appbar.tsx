import React from 'react';
import styled from 'styled-components';
import { theme } from './theme';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import logo from "../images/logo_header.png";

const LogoImg = styled.img`
    height: ${theme.typography.h4.fontSize};
    margin-right: ${theme.spacing(1)}px;
`;

const LogoLink = styled(Link)`
    margin: ${theme.spacing(2)}px;
    display: flex;
    flex-grow: 1;
    align-items: center;
    font-weight: 600;
    color: inherit;
    &:hover {
        text-decoration: none;
    }
`;


export default function HzhAppBar({ children }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <LogoLink href="/" color="inherit" variant="h5">
                    <LogoImg src={logo} alt="Hoe Zit Het? logo"/>
                    Hoe Zit Het?
                </LogoLink>
                <Button href="/lessen">Onze lessen</Button>
                <span>|</span>
                <Button href="/about">Wie zijn we?</Button>
                <span>|</span>
                <Button href="/trakteer">Trakteer ons!</Button>
            </Toolbar>
        </AppBar>
   );
}