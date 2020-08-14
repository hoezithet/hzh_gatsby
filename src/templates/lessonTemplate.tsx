import React from "react";
import { graphql } from "gatsby";
import "katex/dist/katex.min.css";
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Mute } from "../components/shortcodes/mute";
import { Attention } from "../components/shortcodes/attention";
import { Expand } from "../components/shortcodes/expand";
import Toc from "../components/toc";
import Layout from "../components/layout";
import { Link } from '@material-ui/core';
import BlockquoteBox from "../components/blockquote";

const shortcodes = { Mute, Attention, Expand }

const components = {
    a: Link,
    blockquote: BlockquoteBox,
}

export interface MdxNode {
    frontmatter: { title: string };
    body: string;
    tableOfContents: { items: [{url: string; title: string}] };
    fields: { slug: string };
}

export interface LessonData {
    data: {
        mdx: MdxNode;
    };
    pageContext: {
      parents: [MdxNode];
    };
}

export default function Template(
    { data, pageContext }: LessonData // this prop will be injected by the GraphQL query below.
) {
    const { mdx } = data; // data.mdx holds your post data
    const { frontmatter, body, tableOfContents, fields } = mdx;
    const { slug } = fields;
    const { parents } = pageContext;
    
    const crumbs = parents.reverse().map(item => {
        return { title: item.frontmatter.title,
                 slug: item.fields.slug }
    });
    
    crumbs.push({
        title: frontmatter.title,
        slug: slug
    });

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
