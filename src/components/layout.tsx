import React from 'react';
import PropTypes from "prop-types";

import Container from '@material-ui/core/Container';
import { createGlobalStyle } from 'styled-components';
import COLORS from '../colors';
import Footer from './footer';

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
        <Container maxWidth="md">
            <>
            <main>
                { children }
            </main>
            <Footer
                title="Hoe Zit Het? vzw"
                subtitle="ON 0736.486.356 RPR Brussel"
                facebookLink="https://www.facebook.com/hoezithet"
                githubLink="https://github.com/hoezithet/hoezithet"
                ccLink="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            />
            </>
        </Container>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
