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

    // Handle errors
    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`);
        return;
    }

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

    function nodeToParentPaths(node) {
        const nodePath = nodeToPath(node);
        const parentPaths = [];
        for (let i = 2; i < nodePath.length; i += 2) {
            const parentPath = nodePath.slice(0, -i);
            parentPath.push("section");
            parentPaths.push(parentPath);
        }

        return parentPaths;
    }

    function addNodeToTree(node, tree) {
        const nodePath = nodeToPath(node);
        _.set(tree, nodePath, node);
    }

    const contentTree = {};
    result.data.allMdx.edges.forEach(({ node }) => addNodeToTree(node, contentTree));

    result.data.allMdx.edges.forEach(({ node }) => {
        if (isSection(node)) {
            return;
        }

        const parentNodes = nodeToParentPaths(node).map(path => _.get(contentTree, path));
        createPage({
            path: node.fields.slug,
            component: lessonTemplate,
            context: {
                filePath: node.fileAbsolutePath,
                parents: parentNodes,
            },
        });
    });
};
