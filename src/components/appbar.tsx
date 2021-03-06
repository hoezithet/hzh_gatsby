import React from "react";
import styled from "styled-components";
import { theme } from "./theme";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Button, Link } from "gatsby-theme-material-ui";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Hidden from '@material-ui/core/Hidden';
import logo from "../../images/appbar/logo_header.png";
import logo_yellow from "../../images/appbar/logo_header_yellow_bulb.png";

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

const PageButtonsGrid = styled(Grid)``;

const HzhAppBar = ({ color = "primary", elevation = 1 }: { color: "primary" | "transparent"; elevation: number }) => {
    const logoLink = (
        <Grid item>
            <LogoLink to="/" color="inherit" variant="h5">
                <LogoImg src={color == "transparent" ? logo_yellow : logo} alt="Hoe Zit Het? logo" />
                Hoe Zit Het?
            </LogoLink>
        </Grid>
    );
    const buttonLinks = (
        <Grid item>
            <Button to="/lessen">Lessen</Button>
            <span>|</span>
            <Button to="/trakteer">Drankje trakteren</Button>
            <span>|</span>
            <Button to="/about">Over HZH</Button>
        </Grid>
    );
    return (
        <AppBar position="static" color={color} elevation={elevation}>
            <Toolbar>
                <Grid container alignItems="center">
                    <Grid item xs={12} md={6} container>
                        <Hidden mdUp>
                            <Grid container justify="center">{ logoLink }</Grid>
                        </Hidden>
                        <Hidden smDown>
                            <Grid container justify="flex-start">{ logoLink }</Grid>
                        </Hidden>
                    </Grid>
                    <PageButtonsGrid item xs={12} md={6} container>
                        <Hidden mdUp>
                            <Grid container justify="center">{ buttonLinks }</Grid>
                        </Hidden>
                        <Hidden smDown>
                            <Grid container justify="flex-end">{ buttonLinks }</Grid>
                        </Hidden>
                    </PageButtonsGrid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default HzhAppBar;