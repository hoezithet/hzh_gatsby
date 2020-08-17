import React from "react";
import { graphql } from "gatsby";
import { LayoutProps } from "../components/layout";
import Layout from "../components/layout";
import { Link } from '@material-ui/core';

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
                };
                fileAbsolutePath: string;
            }[];
        }
    }
}

export default function ChapterTemplate({ pageContext, data }: ChapterData) {
    const { crumbs, title } = pageContext;
    const lessonLinks = data.allMdx.nodes.map(node => {
        return <li><Link href= { node.fields.slug }>{ node.frontmatter.title }</Link></li>;
    });

    return (
        <Layout crumbs={ crumbs }>
            <h1>{ title }</h1>
            <ul>
                { lessonLinks }
            </ul>
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
        }
        fileAbsolutePath
      }
    }
  }
`;
