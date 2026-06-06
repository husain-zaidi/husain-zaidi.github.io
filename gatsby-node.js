/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const fs = require(`fs`)
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const blogResourcesSource = path.join(__dirname, `content`, `blog`, `resources`)
const staticResourcesTarget = path.join(__dirname, `static`, `resources`)

const syncBlogResourcesToStatic = () => {
  if (!fs.existsSync(blogResourcesSource)) {
    return
  }

  fs.rmSync(staticResourcesTarget, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(staticResourcesTarget), { recursive: true })
  fs.cpSync(blogResourcesSource, staticResourcesTarget, { recursive: true })
}

exports.onPreBootstrap = () => {
  syncBlogResourcesToStatic()
}

// generate pages by slug
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    })
  })
}
