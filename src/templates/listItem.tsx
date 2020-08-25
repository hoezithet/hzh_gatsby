import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Link } from '@material-ui/core';
import styled from "styled-components";


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

const ListImg = styled.img`
    max-width: 100%;
`;

const ListLink = styled(Link)`
    color: inherit;
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
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
    console.log(JSON.stringify(node, null, 2));
    const imgSlug = node.node.frontmatter.title_img;
    const imgFile = imgData.allFile.edges.find(file =>
        file.node.absolutePath.includes(imgSlug)
    );
    return (
            <ListLink href={ node.node.fields.slug }>
            <>
                <h2>{ node.node.frontmatter.title }</h2>
                <ListImg src={ imgFile ? imgFile.node.publicURL : "" } />
                <p>{ node.node.excerpt }</p>
                <Link href={ node.node.fields.slug }>Lees meer</Link>
            </>
            </ListLink>
        );
}