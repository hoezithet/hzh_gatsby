const { createFilePath } = require(`gatsby-source-filesystem`);

const _ = require("lodash");

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;
    if (node.internal.type === `Mdx`) {
        let slug = createFilePath({ node, getNode, basePath: `src/content`, trailingSlash: false });
        slug = slug.replace("/_index", ""); // Section mdx-files are named "_index.mdx", remove that part
        createNodeField({
            node,
            name: `slug`,
            value: slug,
        });
    }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
    const { createPage } = actions;

    const lessonTemplate = require.resolve(`./src/templates/lessonTemplate.tsx`);

    const result = await graphql(`
        {
            allMdx(sort: { order: DESC, fields: [frontmatter___weight] }) {
                edges {
                    node {
                        fileAbsolutePath
                        fields {
                            slug
                        }
                        frontmatter {
                            title
                        }
                    }
                }
            }
        }
    `);

    function isSection(node) {
        return /.*\/_index.mdx$/.test(node.fileAbsolutePath);
    }

    function nodeToPath(node) {
        const slug = node.fields.slug;
        const slugItems = slug.split("/").slice(1);
        const pathItems = [];
        slugItems.forEach((item, index) => {
            if (index < slugItems.length - 1) {
                pathItems.push(item);
                pathItems.push("contents");
            } else if (!isSection(node)) {
                pathItems.push(item);
            } else {
                pathItems.push(item);
                pathItems.push("section");
            }
        });

        return pathItems;
    }

    function insertContent(node, tree) {
        const nodePath = nodeToPath(node);
        _.set(tree, nodePath, node);
    }

    const contentTree = {};
    result.data.allMdx.edges.forEach(({ node }) => insertContent(node, contentTree));

    // Handle errors
    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`);
        return;
    }

    function getSectionFromLesson(lessonNode, contentTree, sectionIdx) {
        const sectionPath = nodeToPath(lessonNode).slice(0, sectionIdx);
        sectionPath.push("section");
        const sectionNode = _.get(contentTree, sectionPath);
        return sectionNode;
    }

    function getLessonChapter(lessonNode, contentTree) {
        return getSectionFromLesson(lessonNode, contentTree, -2);
    }

    function getLessonCourse(lessonNode, contentTree) {
        return getSectionFromLesson(lessonNode, contentTree, -4);
    }

    result.data.allMdx.edges.forEach(({ node }) => {
        if (isSection(node)) {
            return;
        }

        const chapterNode = getLessonChapter(node, contentTree);
        const courseNode = getLessonCourse(node, contentTree);
        createPage({
            path: node.fields.slug,
            component: lessonTemplate,
            context: {
                filePath: node.fileAbsolutePath,
                chapterTitle: chapterNode.frontmatter.title,
                chapterSlug: chapterNode.fields.slug,
                courseTitle: courseNode.frontmatter.title,
                courseSlug: courseNode.fields.slug,
            },
        });
    });
};
