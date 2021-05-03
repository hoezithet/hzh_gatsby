import React from "react";
import { graphql } from "gatsby";
import "katex/dist/katex.min.css";
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Attention } from "../components/shortcodes/attention";
import { Expand } from "../components/shortcodes/expand";
import ToggleImage from "../components/shortcodes/toggleImage";
import Color, {
    Black,
    LightBlue,
    Blue,
    DarkBlue,
    DarkRed,
    Navy,
    Green,
    Yellow,
    Gold,
    Orange,
    Red,
    Purple,
    Gray,
    Mute,
} from "../components/shortcodes/color";
import Toc from "../components/toc";
import Layout from "../components/layout";
import Sponsors from '../components/sponsors';
import Feedback from "../components/feedback";
import PrintLink from "../components/printlink";
import { Exercise } from "../components/shortcodes/exercise";
import { Answer } from "../components/shortcodes/answer";
import { AnswerFeedback } from "../components/shortcodes/answerFeedback";
import { ExerciseStepper } from "../components/shortcodes/exerciseStepper";
import { Plot, Fx, Point, Annot, Hair, Line, ArrowLine, Rectangle, SvgNote } from "../components/shortcodes/plot";
import { Link } from 'gatsby-theme-material-ui';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import BlockquoteBox from "../components/blockquote";
import Table from '../components/table';
import { LayoutProps } from "../components/layout";
import Comments from "../components/comments";
import SectionCard, { CardImage } from "./sectionCard";

export const shortcodes = {
    Mute,
    Attention,
    Expand,
    ToggleImage,
    Color,
    Black,
    LightBlue,
    Blue,
    DarkBlue,
    Navy,
    Green,
    Yellow,
    Gold,
    Orange,
    Red, DarkRed, Purple, Gray,
    Exercise, Answer, AnswerFeedback, ExerciseStepper,
    Plot, Fx, Point, Annot, Hair, Line, ArrowLine, Rectangle, SvgNote
};

export const components = {
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
        level: number;
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
      <SectionCard title={ `👈 Vorige les: ${prevLesson.frontmatter.title}` } cardImage={prevLesson.frontmatter.image || defaultImg } link={prevLesson.fields.slug} />
      :
      <></>
    );
    
    const nextSiblingCard = (
      nextLesson ? 
      <SectionCard title={ `Volgende les: ${nextLesson.frontmatter.title} 👉` } cardImage={nextLesson.frontmatter.image || defaultImg } link={nextLesson.fields.slug} />
      :
      <></>
    );
    
    const image = frontmatter.image;
    return (
        <Layout crumbs={ crumbs } description={ frontmatter.description }
                tags={ frontmatter.tags } image={ image ? image.childImageSharp.fixed.src : defaultImg.childImageSharp.fixed.src } >
            <h1>{frontmatter.title}</h1>
            <PrintLink to={ `/bare${lesson.fields.slug}` } />
            <Toc>
                { tableOfContents }
            </Toc>
            <MDXProvider components={ shortcodes }>
              <MDXProvider components={ components }>
                  <MDXRenderer>{body}</MDXRenderer>
              </MDXProvider>
            </MDXProvider>
            <PrintLink to={ `/bare${lesson.fields.slug}` } />
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
                           ...CardImageFragment
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
               defaultImg: file(
                   sourceInstanceName: { eq: "images" }
                   name: { eq: "default_title_img" }
                   extension: { eq: "png" }
               ) {
                   ...CardImageFragment
               }
           }

           fragment SiblingMdxFragment on Mdx {
               fileAbsolutePath
               frontmatter {
                   title
                   image {
                       ...CardImageFragment
                   }
               }
               fields {
                   slug
               }
           }
       `;
