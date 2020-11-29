import React, { useState } from 'react';
import { graphql, useStaticQuery } from "gatsby";
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Img from "gatsby-image";
import styled from "styled-components";

export function useContentImage(src) {
  const { allFile } = useStaticQuery(graphql`
    query ImageQuery {
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
  
  const edge = allFile.edges.find(({ node }) =>
    node.absolutePath.endsWith(src)
  );
  
  if (edge !== undefined) {
    return edge.node;
  } else {
    return null;
  }
}

const CCImageAnchor = styled.a`
color: rgba(0,0,0,0);
position: absolute;
left: -9999px;
`;

export function CCImage(props) {
  return (
    <div about={props.src} >
      <Img loading={props.loading || "lazy"} fluid={props.fluid} alt={props.alt} />
      <CCImageAnchor rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">Attribution-NonCommercial-ShareAlike 4.0 International</CCImageAnchor>
    </div>
  );
}

const LinkImgAnchor = styled.a`
color: rgba(0,0,0,0);
`;
export default function LinkImg(props) {
  return (
    <LinkImgAnchor href={props.src}>
      <CCImage loading={props.loading || "lazy"} fluid={props.fluid} alt={props.alt} />
    </LinkImgAnchor>
  );
}

export function MarkdownImage(props) {
  const [state, setState] = useState({showStripped: true});
                 
  const strippedSrc = props.src.replace(/\.[^.]+$/, '_stripped.png');
  const strippedNode = useContentImage(strippedSrc);
  const strippedImg = strippedNode !== null
                      ?
                      <LinkImg fluid={strippedNode.childImageSharp.fluid}
                       src={strippedNode.publicURL}
                       alt={props.alt}
                       loading="eager" />
                      :
                      null;

  const useStripped = strippedImg !== null;
  
  const node = useContentImage(props.src);
  const image = <LinkImg fluid={node.childImageSharp.fluid}
                 src={node.publicURL}
                 alt={props.alt}
                 loading={useStripped ? "eager" : "lazy"} />;

  const explanationSwitch = (
    <Grid xs={ 12 } item>
      <Grid container justify="flex-end" alignItems="center">
        <Grid item>
          <Switch color="primary" onChange={e => setState({showStripped: !e.target.checked}) } />
        </Grid>
        <Grid item>
          <span>Toon uitleg</span>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Grid container>
      <Grid xs={ 12 } item>
        <Box maxWidth={ 500 } margin={ "auto" }>
          { useStripped && state.showStripped ? strippedImg : image }
        </Box>
      </Grid>
      { useStripped ? explanationSwitch : null }
    </Grid>
  );
}
