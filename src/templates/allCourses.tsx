import React from "react";
import { graphql } from "gatsby";
import { LayoutProps } from "../components/layout";
import Layout from "../components/layout";
import { Link } from '@material-ui/core';
import ListItem from "./listItem";
import _ from "lodash";

interface AllCoursesData {
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
        <>
        <li>
            <a href={ contSectionNode.fields.slug }>{ contSectionNode.frontmatter.title }</a>
            <ol>
                { contContentsChildPaths.map(p => renderContents(tree, p)) }
            </ol>
        </li>
        </>
        );
    } else {
        return <li><a href={ contentsNode.fields.slug }>{ contentsNode.frontmatter.title }</a></li>;
    }
}

export default function ChapterTemplate({ pageContext }: AllCoursesData) {
    const { crumbs, title , tree } = pageContext;
    const treeContents = _.get(tree, ['contents']);
    return (
        <Layout crumbs={ crumbs }>
            <h1>{ title }</h1>
            <ol>
            { Object.keys(treeContents).map(p => renderContents(treeContents, [p])) }
            </ol>
        </Layout>
    );
}