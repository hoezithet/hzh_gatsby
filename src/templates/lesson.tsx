import React from "react";
import { graphql } from "gatsby";
import "katex/dist/katex.min.css";
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Mute } from "../components/shortcodes/mute";
import { Attention } from "../components/shortcodes/attention";
import { Expand } from "../components/shortcodes/expand";
import { Bokeh } from "../components/shortcodes/bokeh";
import Toc from "../components/toc";
import Layout from "../components/layout";
import Sponsors from '../components/sponsors';
import { Link } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import BlockquoteBox from "../components/blockquote";
import Table from '../components/table';
import { LayoutProps } from "../components/layout";
import Comments from "../components/comments";
import SectionItem from "./sectionItem";

const shortcodes = { Mute, Attention, Expand, Bokeh }

const components = {
    a: Link,
    blockquote: BlockquoteBox,
    table: Table,
}

export interface MdxNode {
    frontmatter: { title: string };
    body: string;
    tableOfContents: { items: {url: string; title: string}[] };
    fields: { slug: string };
}

export interface LessonData {
    data: {
        mdx: MdxNode;
    };
    pageContext: {
      crumbs: LayoutProps["crumbs"];
      siblings: object[];
    };
}

export default function Template(
    { data, pageContext }: LessonData // this prop will be injected by the GraphQL query below.
) {
    const { mdx } = data; // data.mdx holds your post data
    const { frontmatter, body, tableOfContents, fields } = mdx;
    const { crumbs, siblings } = pageContext;
    const siblingSlugs = siblings.map(s => s.fields.slug);
    const pageIdx = siblingSlugs.findIndex(s => s === fields.slug);
    const prevSibling = pageIdx - 1 >= 0 ? siblings[pageIdx - 1] : null;
    const nextSibling = pageIdx + 1 < siblings.length ? siblings[pageIdx + 1] : null;
    const prevSiblingCard = (
      prevSibling ? 
      <SectionItem title={ `👈 Vorige les: ${prevSibling.frontmatter.title}` } titleImg={prevSibling.frontmatter.title_img } buttonLink={prevSibling.fields.slug} />
      :
      <></>
    );
    
    const nextSiblingCard = (
      nextSibling ? 
      <SectionItem title={ `Volgende les: ${nextSibling.frontmatter.title} 👉` } titleImg={nextSibling.frontmatter.title_img } buttonLink={nextSibling.fields.slug} />
      :
      <></>
    );
    
    return (
        <Layout crumbs={ crumbs }>
            <h1>{frontmatter.title}</h1>
            <Toc>
                { tableOfContents }
            </Toc>
            <MDXProvider components={ shortcodes }>
              <MDXProvider components={ components }>
                  <MDXRenderer>{body}</MDXRenderer>
              </MDXProvider>
            </MDXProvider>
            <Grid container spacing={ 2 } justify="space-between">
                { prevSiblingCard }
                { nextSiblingCard }
            </Grid>
            <Box my={ 4 } textAlign="center" justifyContent="center">
                <Sponsors />
            </Box>
            <Comments />
        </Layout>
    );
}

export const pageQuery = graphql`
  query LessonQuery($filePath: String!) {
    mdx(fileAbsolutePath: { eq: $filePath }) {
      body
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
      }
      tableOfContents(maxDepth: 2)
      fields {
        slug
      }
    }
  }
`;
