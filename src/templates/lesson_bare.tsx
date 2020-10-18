import React from "react";
import { graphql } from "gatsby";
import "katex/dist/katex.min.css";
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Mute } from "../components/shortcodes/mute";
import { Attention } from "../components/shortcodes/attention";
import { ExpandBare as Expand } from "../components/shortcodes/expand";
import { BokehBare as Bokeh } from "../components/shortcodes/bokeh";
import Sponsors from '../components/sponsors';
import Image from "../components/image";
import HzhTheme from '../components/theme';

import { Link } from 'gatsby-theme-material-ui';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import BlockquoteBox from "../components/blockquote";
import Table from '../components/table';
import { LayoutProps } from "../components/layout";

const shortcodes = { Mute, Attention, Expand, Bokeh }


const components = {
    a: Link,
    blockquote: BlockquoteBox,
    table: Table,
    img: Image,
}

export interface MdxNode {
    frontmatter: { title: string };
    body: string;
}

export interface LessonData {
    data: {
        mdx: MdxNode;
    };
}

export default function Template(
    { data }: LessonData
) {
    const { mdx } = data;
    const { frontmatter, body } = mdx;

    return (
        <HzhTheme>
            <h1>{frontmatter.title}</h1>
            <MDXProvider components={ shortcodes }>
              <MDXProvider components={ components }>
                  <MDXRenderer>{body}</MDXRenderer>
              </MDXProvider>
            </MDXProvider>
            <Box my={ 4 } textAlign="center" justifyContent="center">
                <Sponsors />
            </Box>
        </HzhTheme>
    );
}

export const pageQuery = graphql`
  query BareLessonQuery($filePath: String!) {
    mdx(fileAbsolutePath: { eq: $filePath }) {
      body
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
      }
    }
  }
`;
