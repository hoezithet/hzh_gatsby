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
import Feedback from "../components/feedback";


import { Link } from 'gatsby-theme-material-ui';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import BlockquoteBox from "../components/blockquote";
import Table from '../components/table';
import { LayoutProps } from "../components/layout";
import Comments from "../components/comments";
import SectionCard, { CardImage } from "./sectionCard";
import { FixedObject } from "gatsby-image";

const shortcodes = { Mute, Attention, Expand, Bokeh }


const components = {
    a: Link,
    blockquote: BlockquoteBox,
    table: Table,
}

export interface MdxNode {
    frontmatter: {
        title: string;
        description: string;
        tags: string[];
        image: CardImage;
    };
    body: string;
    tableOfContents: { items: { url: string; title: string }[] };
    fields: {
        slug: string
        content_type: string;
        chapter_slug: string;
        course_slug: string;
        all_courses_slug: string;
    };
    excerpt: string;
}

export interface LessonData {
    data: {
        lesson: MdxNode;
        nextLesson: MdxNode;
        prevLesson: MdxNode;
        defaultImg: CardImage;
    };
    pageContext: {
      crumbs: LayoutProps["crumbs"];
    };
}

export default function Template(
    { data, pageContext }: LessonData // this prop will be injected by the GraphQL query below.
) {
    const { lesson, nextLesson, prevLesson, defaultImg } = data;
    const { frontmatter, body, tableOfContents } = lesson;
    const { crumbs } = pageContext;
    const prevSiblingCard = (
      prevLesson ? 
      <SectionCard title={ `👈 Vorige les: ${prevLesson.frontmatter.title}` } cardImage={prevLesson.frontmatter.image } link={prevLesson.fields.slug} />
      :
      <></>
    );
    
    const nextSiblingCard = (
      nextLesson ? 
      <SectionCard title={ `Volgende les: ${nextLesson.frontmatter.title} 👉` } cardImage={nextLesson.frontmatter.image} link={nextLesson.fields.slug} />
      :
      <></>
    );
    
    const image = frontmatter.image;
    return (
        <Layout crumbs={ crumbs } description={ frontmatter.description }
                tags={ frontmatter.tags } image={ image ? image.childImageSharp.fixed.src : defaultImg.childImageSharp.fixed.src } >
            <h1>{frontmatter.title}</h1>
            <Toc>
                { tableOfContents }
            </Toc>
            <MDXProvider components={ shortcodes }>
              <MDXProvider components={ components }>
                  <MDXRenderer>{body}</MDXRenderer>
              </MDXProvider>
            </MDXProvider>
            <Feedback />
            <Box my={ 4 }>
                <Grid container spacing={ 2 } justify="space-between">
                    { prevSiblingCard }
                    { nextSiblingCard }
                </Grid>
            </Box>
            <Box my={ 4 } textAlign="center" justifyContent="center">
                <Sponsors />
            </Box>
            <Comments />
        </Layout>
    );
}

export const pageQuery = graphql`
    query LessonQuery($filePath: String!, $prevPath: String, $nextPath: String) {
        lesson: mdx(fileAbsolutePath: { eq: $filePath }) {
            body
            frontmatter {
                title
                description
                tags
                image {
                    ...LessonImageFragment
                }
            }
            tableOfContents(maxDepth: 2)
            fields {
                slug
            }
        }
        prevLesson: mdx(fileAbsolutePath: { eq: $prevPath }) {
          ...SiblingMdxFragment
        }
        nextLesson: mdx(fileAbsolutePath: { eq: $nextPath }) {
          ...SiblingMdxFragment
        }
        defaultImg: file(sourceInstanceName: {eq: "images"}, name: {eq: "default_title_img"}, extension: {eq: "png"}) {
          ...LessonImageFragment
        }
    }

    fragment LessonImageFragment on File {
        childImageSharp {
            fixed(height: 140) {
                ...GatsbyImageSharpFixed_tracedSVG
            }
        }
    }

    fragment SiblingMdxFragment on Mdx {
        fileAbsolutePath
        frontmatter {
            title
            image {
                ...LessonImageFragment
            }
        }
        fields {
            slug
        }
    }
`;
