import React from "react";
import { graphql } from "gatsby";
require(`katex/dist/katex.min.css`);
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Mute } from "../components/shortcodes/mute";
import { Attention } from "../components/shortcodes/attention";
import { Expand } from "../components/shortcodes/expand";
import Layout from "../general/layout";

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
    const tocItems = tableOfContents.items.map((item) => <li><a href={item.url}>{item.title}</a></li>);
    return (
        <Layout>
            <ul>{ tocItems }</ul>
            <h1>{frontmatter.title}</h1>
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
