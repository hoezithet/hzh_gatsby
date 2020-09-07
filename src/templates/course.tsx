import React from "react";
import { graphql } from "gatsby";
import { LayoutProps } from "../components/layout";
import Layout from "../components/layout";
import { Link } from '@material-ui/core';
import SectionItem from "./sectionItem";
import Grid from '@material-ui/core/Grid';
import _ from "lodash";

interface CourseData {
    pageContext: {
        crumbs: LayoutProps["crumbs"];
        slug: string;
        title: string;
        tree: object;
    }
}

function renderContents(tree, contentsPath) {
    const contentsNode = _.get(tree, contentsPath);
    
    if ('section' in contentsNode) {
        const contSectionNode = _.get(tree, contentsPath.concat(['section']));
        const contContentsPath = contentsPath.concat(['contents']);
        const contContentsNode = _.get(tree, contContentsPath);
        const contContentsChildPaths = Object.keys(contContentsNode).map(k => contContentsPath.concat([k]));
        
        return (
        <SectionItem
             title={contSectionNode.frontmatter.title}
             titleImg={contSectionNode.frontmatter.title_img}
             buttonLink={contSectionNode.fields.slug}
             buttonText={"Ga naar hoofdstuk"}>
            <ol>
                { contContentsChildPaths.map(p => renderContents(tree, p)) }
            </ol>
        </SectionItem>
        );
    } else {
        return <li><Link href={ contentsNode.fields.slug }>{ contentsNode.frontmatter.title }</Link></li>;
    }
}

export function compareContentKeys(k1, k2, tree) {
    return _.get(tree, [k1, 'section']).frontmatter.weight - _.get(tree, [k2, 'section']).frontmatter.weight;
}

export function CourseChapters({treeContents}) {
    return (
    <Grid container spacing={2}>
        { Object.keys(treeContents).sort((k1, k2) => compareContentKeys(k1, k2, treeContents)).map(p => renderContents(treeContents, [p])) }
    </Grid>
    );
}

export default function CourseTemplate({ pageContext }: CourseData) {
    const { crumbs, title , tree } = pageContext;
    const treeContents = _.get(tree, ['contents']);
    return (
        <Layout crumbs={ crumbs }>
            <h1>{ title }</h1>
            <CourseChapters treeContents={treeContents}/>
        </Layout>
    );
}