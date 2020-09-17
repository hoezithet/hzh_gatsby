import React from 'react';
import styled from 'styled-components';
import { theme } from './theme';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
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

const PageButtonsGrid = styled(Grid)`
`;


export default function HzhAppBar({ children }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item xs={ 6 } md={ 6 }>
                        <Box justifyContent="center">
                            <LogoLink href="/" color="inherit" variant="h5">
                                <LogoImg src={logo} alt="Hoe Zit Het? logo"/>
                                Hoe Zit Het?
                            </LogoLink>
                        </Box>
                    </Grid>
                    <PageButtonsGrid item >
                        <Button href="/lessen">Onze lessen</Button>
                        <span>|</span>
                        <Button href="/about">Wie zijn we?</Button>
                        <span>|</span>
                        <Button href="/trakteer">Trakteer ons!</Button>
                    </PageButtonsGrid>
                </Grid>
            </Toolbar>
        </AppBar>
   );
}
