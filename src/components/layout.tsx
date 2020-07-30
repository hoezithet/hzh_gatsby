import React from 'react';
import PropTypes from "prop-types";

import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import COLORS from '../colors';

export interface LayoutProps {
    children: React.ReactNode;
}

const Main = styled.main`
    background-color: ${COLORS.NEAR_WHITE};
`

const Layout = ({ children }: LayoutProps) => {
    return (
        <Main>
            <Container maxWidth="md">
                <>
                { children }
                </>
            </Container>
        </Main>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
