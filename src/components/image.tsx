import React from 'react';
import { useStaticQuery, graphql } from "gatsby";
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Img from "gatsby-image";


function Image(props) {
    const imgData = useStaticQuery(graphql`
    {
      allFile(filter: { extension: { eq: "png" } }) {
        edges {
          node {
            childImageSharp {
              fluid(maxWidth: 500) {
                  ...GatsbyImageSharpFluid_tracedSVG
              }
            }
            publicURL
            absolutePath
          }
        }
      }
    }
    `);
    
    const imgEdge = imgData.allFile.edges.find(({ node }) =>
        node.absolutePath.endsWith(props.src)
    );

    const absPath = imgEdge.node.absolutePath;
    const strippedAbsPath = absPath.replace(/\.[^.]+$/, '_stripped.png');
    const strippedImgEdge = imgData.allFile.edges.find(({ node }) =>
        node.absolutePath === strippedAbsPath
    );

    const useStripped = strippedImgEdge !== undefined;

    const node = useStripped ? strippedImgEdge.node : imgEdge.node;

    const explanationSwitch = (
            <Grid xs={ 12 } item>
                <Switch />
                <span>Toon uitleg</span>
            </Grid>
    );

    return (
        <Grid container>
            <Grid xs={ 12 } item>
                <Box maxWidth={ 500 } margin={ "auto" }>
                    <a href={node.publicURL}>
                        <Img fluid={node.childImageSharp.fluid} alt={props.alt} />
                    </a>
                </Box>
            </Grid>
            { useStripped ? explanationSwitch : null }
        </Grid>
    );
}

export default Image;
