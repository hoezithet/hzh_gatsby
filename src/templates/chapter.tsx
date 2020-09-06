import React from "react";
import { graphql } from "gatsby";
import { LayoutProps } from "../components/layout";
import Layout from "../components/layout";
import { Link } from '@material-ui/core';
import SectionItem from "./sectionItem";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
                    title_img: string;
                };
                fileAbsolutePath: string;
                excerpt: string;
            }[];
        }
    }
}

export default function ChapterTemplate({ pageContext, data }: ChapterData) {
    const { crumbs, title } = pageContext;
    
    const lessonLinks = data.allMdx.nodes.map(node => {
        const title = node.frontmatter.title;
        const titleImg = node.frontmatter.title_img;
        const buttonLink = node.fields.slug;
        const buttonText = "Lees meer";
        return (<SectionItem title={title} titleImg={titleImg} buttonLink={buttonLink} buttonText={buttonText}>
                    { node.frontmatter.description ? node.frontmatter.description : node.excerpt }
                </SectionItem>
            );
    }
    );

    return (
        <Layout crumbs={ crumbs }>
            <h1>{ title }</h1>
            <Grid container spacing={2}>
                { lessonLinks }
            </Grid>
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
          title_img
        }
        fileAbsolutePath
        excerpt(pruneLength: 200, truncate: true)
      }
    }
  }
`;
