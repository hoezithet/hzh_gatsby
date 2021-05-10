import React from "react";
import { graphql } from "gatsby";
import "katex/dist/katex.min.css";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Sponsors from "../components/sponsors";
import HzhTheme from "../components/theme";

import { Link } from "gatsby-theme-material-ui";
import Box from "@material-ui/core/Box";
import { components, MdxNode, shortcodes } from "./lesson";
import { ToggleImageBare } from "../components/shortcodes/toggleImage";
import { ExpandBare } from "../components/shortcodes/expand";

const bareShortcodes = {
    ...shortcodes,
    ToggleImage: ToggleImageBare,
    Expand: ExpandBare
};

export interface LessonData {
    data: {
        lesson: MdxNode;
        site: {
            siteMetadata: {
                siteUrl: string;
            };
        };
    };
}

export default function Template({ data }: LessonData) {
    const { lesson, site } = data;
    const { siteMetadata } = site;
    const { frontmatter, body, fields } = lesson;
    const absURL = `${new URL(fields.slug, siteMetadata.siteUrl)}`;

    return (
        <HzhTheme>
            <>
                <h1>{frontmatter.title}</h1>
                <p>
                    <span>Bron: </span>
                    <Link to={absURL}>{absURL}</Link>
                </p>
                <MDXProvider components={bareShortcodes}>
                    <MDXProvider components={components}>
                        <MDXRenderer>{body}</MDXRenderer>
                    </MDXProvider>
                </MDXProvider>
                <Box my={4} textAlign="center" justifyContent="center">
                    <Sponsors />
                </Box>
            </>
        </HzhTheme>
    );
}

export const pageQuery = graphql`
    query BareLessonQuery($filePath: String!) {
        lesson: mdx(fileAbsolutePath: { eq: $filePath }) {
            body
            frontmatter {
                title
            }
            fields {
                slug
            }
        }

        site {
            siteMetadata {
                siteUrl
            }
        }
    }
`;
