import React from 'react';
import PropTypes from "prop-types";

import Container from '@material-ui/core/Container';
import { styled, createGlobalStyle } from 'styled-components';
import COLORS from '../colors';

export interface LayoutProps {
    children: React.ReactNode;
}


const GlobalStyle = createGlobalStyle`
    body {
        background-color: ${COLORS.NEAR_WHITE};
    }
    a {
        color: 'red';
    }
`

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
        <GlobalStyle/>
        <main>
            <Container maxWidth="md">
                <>
                { children }
                </>
            </Container>
        </main>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
