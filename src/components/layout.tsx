import React from 'react';
import PropTypes from "prop-types";
import Container from '@material-ui/core/Container';
import styled from 'styled-components';

import Footer from './footer';
import Crumbs from './crumbs';
import { CrumbProps } from './crumbs';
import HzhAppBar from './appbar';
import HzhTheme from './theme';
import { theme } from './theme';

export interface LayoutProps {
    children: React.ReactNode;
    crumbs?: CrumbProps["crumbs"];
}

const HzhContainer = styled(Container)`
    padding: ${theme.spacing(2)}px;
`;

const HzhMain = styled.main`
    margin-bottom: ${theme.spacing(4)}px;
`;


const Layout = ({ children, crumbs }: LayoutProps) => {
    const breadCrumbs = crumbs ? <Crumbs crumbs={ crumbs }/> : <></>;
    return (
        <HzhTheme>
            <HzhAppBar />
            <HzhContainer maxWidth="md">
                <>
                { breadCrumbs }
                <HzhMain>{ children }</HzhMain>
                <Footer />
                </>
            </HzhContainer>
        </HzhTheme>);
    };
    
    Layout.propTypes = {
        children: PropTypes.node.isRequired,
    };
    
    export default Layout;
    
