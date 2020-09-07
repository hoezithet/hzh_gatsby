import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Link } from '@material-ui/core';
import styled from "styled-components";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';


interface SectionItemProps {
    title: string;
    titleImg: string;
    buttonLink: string;
    buttonText: string;
    children: React.ReactElement;
}

const CardImg = styled(CardMedia)`
    height: 140px;
`;

const StyledCard = styled(Card)`
    
`;

export default function SectionItem({title, titleImg, buttonLink, buttonText, children}: SectionItemProps) {
    const imgData = useStaticQuery(graphql`
    {
      allFile(filter: { extension: { eq: "png" } }) {
        edges {
          node {
            publicURL
            absolutePath
          }
        }
      }
    }
    `);

    let imgSlug = titleImg;
    if (imgSlug == null || imgSlug === "") {
        imgSlug = "images/default_title_img.png";
    }
    const imgFile = imgData.allFile.edges.find(file =>
        file.node.absolutePath.includes(imgSlug)
    );
    return (
    <Grid item xs={12} sm={4}>
            <StyledCard>
      <CardActionArea>
        <CardImg
          image={ imgFile ? imgFile.node.publicURL : "" } 
          title={ title }
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            { title }
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            { children }
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button href={ buttonLink } size="small" color="primary">
            { buttonText }
        </Button>
      </CardActions>
    </StyledCard>
    </Grid>
        );
}
