import React from "react";
import { graphql } from "gatsby";
import { LayoutProps } from "../components/layout";
import Layout from "../components/layout";

interface ChapterData {
    pageContext: {
        title: string;
        lessons: {
            title: string;
            slug: string;
        }[];
        crumbs: LayoutProps["crumbs"];
    }
}

export default function ChapterTemplate({ pageContext }: ChapterData) {
    const { title, lessons, crumbs } = pageContext;
    const lessonLinks = lessons.map(({ title, slug }) =>
        <a href={ slug }>{ title }</a>);

    return (
        <Layout crumbs={ crumbs }>
            <h1>{ title }</h1>
            { lessonLinks }
        </Layout>
    );
}
