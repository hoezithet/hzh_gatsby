import React from 'react';
import PropTypes from "prop-types";

import Container from '@material-ui/core/Container';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import styled from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import logo from "../images/logo_header.png";
import COLORS from '../colors';
import Footer from './footer';
import Header from './header';
import { HeaderProps } from './header';

import 'fontsource-quicksand';

export interface LayoutProps {
    children: React.ReactNode;
    crumbs: HeaderProps["crumbs"];
}

export const muiTheme = createMuiTheme({
    typography: {
        fontFamily: [
            'Quicksand',
            'sans-serif',
        ].join(','),
    },
    palette: {
        primary: {
            main: COLORS.GOLD,
        },
        secondary: {
            main: COLORS.DARK_BLUE,
        },
        error: {
            main: COLORS.DARK_RED,
        },
        warning: {
            main: COLORS.ORANGE,
        },
        info: {
            main: COLORS.LIGHT_BLUE,
        },
        success: {
            main: COLORS.GREEN,
        },
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    backgroundColor: COLORS.NEAR_WHITE,
                    fontSize: "1rem",
                    lineHeight: 1.5,
                },
                "a.anchor": {
                    margin: "0 8px 0 0",
                },
            }
        },
        MuiLink: {
            root: {
                color: COLORS.BLUE,
                "&:hover": {
                    opacity: "60%",
                },
            }
        }
    }
});

const HzhContainer = styled(Container)`
    padding: ${muiTheme.spacing(2)}px;
`;

const LogoImg = styled.img`
    height: ${muiTheme.typography.h4.fontSize};
    margin-right: ${muiTheme.spacing(1)}px;
`;

const LogoLink = styled(Link)`
    margin: ${muiTheme.spacing(2)}px;
    display: flex;
    flex-grow: 1;
    align-items: center;
    font-weight: 600;
    color: inherit;
    &:hover {
        text-decoration: none;
    }
`;

const Layout = ({ children, crumbs }: LayoutProps) => {
    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
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
            <HzhContainer maxWidth="md">
                <>
                <Header crumbs={ crumbs }/>
                <main>{ children }</main>
                <Footer title="Hoe Zit Het? vzw"
                subtitle="ON 0736.486.356 RPR Brussel"
                facebookLink="https://www.facebook.com/hoezithet"
                githubLink="https://github.com/hoezithet/hoezithet"
                ccLink="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                />
                </>
            </HzhContainer>
        </ThemeProvider>);
    };
    
    Layout.propTypes = {
        children: PropTypes.node.isRequired,
    };
    
    export default Layout;
    
