import React from "react";
import { graphql } from "gatsby";

export interface LessonData {
  data: {
    markdownRemark: {
      frontmatter: { title: string };
      html: string;
    };
  }
}

export default function Template({
    data, // this prop will be injected by the GraphQL query below.
}: LessonData) {
    const { markdownRemark } = data; // data.markdownRemark holds your post data
    const { frontmatter, html } = markdownRemark;
    return (
        <div className="blog-post-container">
            <div className="blog-post">
                <h1>{frontmatter.title}</h1>
                <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </div>
    );
}
export const pageQuery = graphql`
    query($filePath: String!) {
        markdownRemark(fileAbsolutePath: { eq: $filePath }) {
            html
            frontmatter {
                date(formatString: "MMMM DD, YYYY")
                title
            }
        }
    }
`;
