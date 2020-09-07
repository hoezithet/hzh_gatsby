import React from "react";
import { graphql } from "gatsby";
import { LayoutProps } from "../components/layout";
import Layout from "../components/layout";
import { Link } from '@material-ui/core';
import SectionItem from "./sectionItem";
import Grid from '@material-ui/core/Grid';
import _ from "lodash";
import { CourseChapters, compareContentKeys } from "./course";

interface AllCoursesData {
    pageContext: {
        crumbs: LayoutProps["crumbs"];
        slug: string;
        title: string;
        tree: object;
    }
}


export default function AllCoursesTemplate({ pageContext }: AllCoursesData) {
    const { crumbs, title , tree } = pageContext;
    const courseTrees = _.get(tree, ['contents']);
    return (
        <Layout crumbs={ crumbs }>
            <h1>{ title }</h1>
            { Object.keys(courseTrees).sort((k1, k2) => compareContentKeys(k1, k2, courseTrees)).map(p => <><h2>{_.get(tree, ['contents', p, 'section']).frontmatter.title }</h2> <CourseChapters treeContents={_.get(tree, ['contents', p, 'contents'])}/></> ) }
        </Layout>
    );
}