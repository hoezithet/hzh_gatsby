import React from "react";
import { graphql } from "gatsby";
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Mute } from "../components/shortcodes/mute";
import { Attention } from "../components/shortcodes/attention";
import { Expand } from "../components/shortcodes/expand";
import Toc from "../components/toc";
import Layout from "../components/layout";

const shortcodes = { Mute, Attention, Expand }

export interface LessonData {
    data: {
        mdx: {
            frontmatter: { title: string };
            body: string;
            tableOfContents: { items: [{url: string, title: string}] };
        };
    }
}

export default function Template({
    data, // this prop will be injected by the GraphQL query below.
}: LessonData) {
    const { mdx } = data; // data.mdx holds your post data
    const { frontmatter, body, tableOfContents } = mdx;
    return (
        <Layout>
            <h1>{frontmatter.title}</h1>
            <Toc>
                { tableOfContents }
            </Toc>
            <MDXProvider components={shortcodes}>
                <MDXRenderer>{body}</MDXRenderer>
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
    }
  }
`;
