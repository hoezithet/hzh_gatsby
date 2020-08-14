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

function isLesson(node) {
    return /([^/]+\/){4}\/index\.mdx$/.test(node.slug);
}

function isChapter(node) {
    return /([^/]+\/){3}\/_index\.mdx$/.test(node.slug);
}

function isCourse(node) {
    return /([^/]+\/){2}_index\.mdx$/.test(node.slug);
}

function isAllCourses(node) {
    return /([^/]+\/){1}_index\.mdx$/.test(node.slug);
}

/**
 * Converts the node to the lodash path it would have in the content tree.
 * @param { MdxNode } node The MDX node.
 * @return { String[] } The lodash path of the node, based on its slug.
 */
function nodeToPath(node) {
    const slug = node.fields.slug;
    const slugItems = slug.split("/").slice(1);
    const pathItems = [];
    slugItems.forEach((item, index) => {
        if (index < slugItems.length - 1) {
            pathItems.push(item);
            pathItems.push("contents");
        } else if (isLesson(node)) {
            pathItems.push(item);
        } else {
            pathItems.push(item);
            pathItems.push("section");
        }
    });

    return pathItems;
}

/**
 * Returns an array of lodash paths of the ancestors of the given node. The
 * first element is the path of closest ancestor to the node. The last
 * element is the path of the root ancestor node.
 * @param { MdxNode } node The MDX node.
 * @return { String[][] } The lodash paths of the node's ancestors.
 */
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

/**
 * Get the breadcrumbs for the given node, based on the given content tree.
 * @param { MdxNode } node The MDX node for which to get a list of crumbs.
 * @param { object } contentTree The content tree that contains the node and all
 * other content and section nodes.
 * @return { object[] } The breadcrumbs as an array where each element has a
 * property `title` and `slug`.
 */
function nodeToCrumbs(node, contentTree) {
    const nodes = nodeToParentPaths(node).map(path => _.get(contentTree, path));
    nodes.push(node);
    return nodes.reverse().map(item => {
        return { title: item.frontmatter.title, slug: item.fields.slug };
    });
}

/**
 * Get the lessons in the given chapter node, based on the given content tree.
 * @param { MdxNode } chapterNode The chapter node.
 * @param { object } contentTree The content tree that contains the node and all
 * other content and section nodes.
 * @return { object[] } The lessons in the chapter as an array where each element
 * has a property `title` and `slug`.
 */
function chapterLessons(chapterNode, contentTree) {
    const lessonPaths = nodeToPath(chapterNode);
    lessonPaths.push("contents");
    console.log(chapterNode);
    console.log(lessonPaths);
    console.log("The tree:");
    console.log(JSON.stringify(contentTree, null, 2));
    lessonNodes = lessonPaths.map(p => _.get(contentTree, p));
    return lessonNodes.map(node => {
        return {
            title: node.frontmatter.title,
            slug: node.fields.slug,
        };
    });
}

function addNodeToTree(node, tree) {
    const nodePath = nodeToPath(node);
    _.set(tree, nodePath, node);
}

exports.createPages = async ({ actions, graphql, reporter }) => {
    const { createPage } = actions;

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

    const contentTree = {};
    result.data.allMdx.edges.forEach(({ node }) => addNodeToTree(node, contentTree));

    result.data.allMdx.edges.forEach(({ node }) => {
        if (isLesson(node)) {
            createPage({
                path: node.fields.slug,
                component: require.resolve("./src/templates/lesson.tsx"),
                context: {
                    filePath: node.fileAbsolutePath,
                    crumbs: nodeToCrumbs(node),
                },
            });
        } else if (isChapter(node)) {
            createPage({
                path: node.fields.slug,
                component: require.resolve("./src/templates/chapter.tsx"),
                context: {
                    title: node.frontmatter.title,
                    lessons: chapterLessons(node, contentTree),
                    crumbs: nodeToCrumbs(node),
                },
            });
        }
    });
};
