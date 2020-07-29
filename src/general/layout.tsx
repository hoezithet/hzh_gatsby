import React from 'react';
import PropTypes from "prop-types";

import Container from '@material-ui/core/Container';

export interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <Container maxWidth="md">
            <main>
            { children }
            </main>
        </Container>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
