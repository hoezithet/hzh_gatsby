import React from "react";
import { graphql } from "gatsby";
require(`katex/dist/katex.min.css`);

export interface LessonData {
  data: {
    markdownRemark: {
      frontmatter: { title: string };
      html: string;
      tableOfContents: string;
    };
  }
}

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}: LessonData) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html, tableOfContents } = markdownRemark;
  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <div dangerouslySetInnerHTML={{ __html: tableOfContents }} />
        
        <h1>{frontmatter.title}</h1>
        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query LessonQuery($filePath: String!) {
    markdownRemark(fileAbsolutePath: { eq: $filePath }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
      }
      tableOfContents(absolute: false, maxDepth: 2)
    }
  }
`;
