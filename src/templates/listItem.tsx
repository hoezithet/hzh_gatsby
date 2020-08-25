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


interface ListItemProps {
  fields: { slug: string; };
  frontmatter: {
      title: string;
      description: string;
      title_img: string;
  };
  fileAbsolutePath: string;
  excerpt: string;
}

const CardImg = styled(CardMedia)`
`;

const StyledCard = styled(Card)`
    max-width: 345;
`;

export default function ListItem(node: ListItemProps) {
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

    const imgSlug = node.node.frontmatter.title_img;
    const imgFile = imgData.allFile.edges.find(file =>
        file.node.absolutePath.includes(imgSlug)
    );
    return (
    <Box my={2}>
            <StyledCard>
      <CardActionArea>
        <CardImg
          component="img"
          height="100%"
          image={ imgFile ? imgFile.node.publicURL : "" } 
          title={ node.node.frontmatter.title }
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            { node.node.frontmatter.title }
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            { node.node.frontmatter.description ? node.node.frontmatter.description : node.node.excerpt }
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button href={ node.node.fields.slug } size="small" color="primary">
          Lees Meer
        </Button>
      </CardActions>
    </StyledCard>
    </Box>
        );
}