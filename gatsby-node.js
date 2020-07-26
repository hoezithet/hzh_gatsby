exports.createPages = async ({ actions, graphql, reporter }) => {
    const { createPage } = actions;

    const lessonTemplate = require.resolve(`./src/templates/lessonTemplate.tsx`);

    const result = await graphql(`
        {
            allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___weight] }, limit: 1000) {
                edges {
                    node {
                        fileAbsolutePath
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

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
            path: node.fileAbsolutePath.replace(/^.*\/src\/content/, "").replace(/\/index\.md$/, ""),
            component: lessonTemplate,
            context: {
                filePath: node.fileAbsolutePath,
            },
        });
    });
};
