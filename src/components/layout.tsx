import React from 'react';
import PropTypes from "prop-types";

import Container from '@material-ui/core/Container';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import COLORS from '../colors';
import Footer from './footer';
import Header from './header';

import 'fontsource-quicksand';

export interface LayoutProps {
    children: React.ReactNode;
    slug: string;
}

const muiTheme = createMuiTheme({
    typography: {
        fontFamily: [
            'Quicksand',
            'sans-serif',
        ].join(','),
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    backgroundColor: COLORS.NEAR_WHITE,
                    fontSize: "1rem",
                    lineHeight: 1.5,
                },
                a: {
                    color: 'red',
                }
            }
        }
    },
});

const Layout = ({ children, slug }: LayoutProps) => {
    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Container maxWidth="md">
                <>
                <Header slug={ slug }/>
                <main>{ children }</main>
                <Footer title="Hoe Zit Het? vzw"
                subtitle="ON 0736.486.356 RPR Brussel"
                facebookLink="https://www.facebook.com/hoezithet"
                githubLink="https://github.com/hoezithet/hoezithet"
                ccLink="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                />
                </>
            </Container>
        </ThemeProvider>);
    };
    
    Layout.propTypes = {
        children: PropTypes.node.isRequired,
    };
    
    export default Layout;
    