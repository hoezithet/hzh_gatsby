const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;
    if (node.internal.type === `Mdx`) {
        const slug = createFilePath({ node, getNode, basePath: `src/content`, trailingSlash: false });
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
            allMdx(sort: { order: DESC, fields: [frontmatter___weight] }, limit: 1000) {
                edges {
                    node {
                        fileAbsolutePath
                        fields {
                            slug
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

    result.data.allMdx.edges.forEach(({ node }) => {
        createPage({
            path: node.fields.slug,
            component: lessonTemplate,
            context: {
                filePath: node.fileAbsolutePath,
            },
        });
    });
};
