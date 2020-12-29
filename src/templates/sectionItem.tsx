import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import styled from "styled-components";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { CardActionArea } from "gatsby-theme-material-ui";
import Img from "gatsby-image/withIEPolyfill";
import COLORS from "../colors.js";


interface SectionItemProps {
    title: string;
    titleImg: string;
    buttonLink: string;
    children?: React.ReactElement|string;
}

const StyledGrid = styled(Grid)`
    background-color: ${COLORS.NEAR_WHITE};
    height: 140px;
`;

const StyledCard = styled(Card)`

`;

export default function SectionItem({title, titleImg, buttonLink, children}: SectionItemProps) {
    let imgSlug = titleImg;
    if (imgSlug == null || imgSlug === "") {
        imgSlug = "images/default_title_img.png";
    }
    return (
        <Grid item xs={12} sm={4}>
            <StyledCard>
                <CardActionArea to={ buttonLink }>
                    <StyledGrid container justify="center">
                        <Grid item>
                            <Img fixed={ imgFile ? imgFile.node.childImageSharp.fixed: "" }
                            objectFit="cover" objectPosition="50% 50%" />
                        </Grid>
                    </StyledGrid>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                        { title }
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            { children }
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </StyledCard>
        </Grid>
    );
}
