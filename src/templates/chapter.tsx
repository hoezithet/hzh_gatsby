import React from "react";
import { graphql } from "gatsby";
import { LayoutProps } from "../components/layout";
import Layout from "../components/layout";
import { Link } from '@material-ui/core';
import ListItem from "./listItem";

interface ChapterData {
    pageContext: {
        crumbs: LayoutProps["crumbs"];
        slug: string;
        title: string;
    }
    data: {
        allMdx: {
            nodes: {
                fields: { slug: string; };
                frontmatter: {
                    title: string;
                    description: string;
                    images: string[];
                };
                fileAbsolutePath: string;
                excerpt: string;
            }[];
        }
    }
}

export default function ChapterTemplate({ pageContext, data }: ChapterData) {
    const { crumbs, title } = pageContext;
    
    const lessonLinks = data.allMdx.nodes.map(node => 
        <ListItem node={ node } />
    );

    return (
        <Layout crumbs={ crumbs }>
            <h1>{ title }</h1>
            { lessonLinks }
        </Layout>
    );
}

export const chapterQuery = graphql`
  query ChapterQuery($slug: String!) {
    allMdx(filter: {fields: {parent_slug: {eq: $slug}}},
           sort: {fields: frontmatter___weight, order: ASC}) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          description
          images
        }
        fileAbsolutePath
        excerpt(pruneLength: 200, truncate: true)
      }
    }
  }
`;
