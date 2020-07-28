import React from "react";
import { graphql } from "gatsby";
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Mute from "../components/shortcodes/mute";

const shortcodes = { Mute }

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
        <div className="blog-post-container">
            <ul>{ tocItems }</ul>
            <h1>{frontmatter.title}</h1>
            <MDXProvider components={shortcodes}>
                <MDXRenderer>{body}</MDXRenderer>
            </MDXProvider>
        </div>
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
