import * as React from "react"
import Helmet from 'react-helmet'
import { graphql } from "gatsby"
import '../assets/scss/main.scss'
import Layout from '../components/layout'

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Blog`
  const postTitle = post.frontmatter.title
  const postDescription = post.frontmatter.description || post.excerpt
  const postUrl = `${location.origin}${location.pathname}`

  return (
    <Layout location={location} pageClassName="blog-page">
     <Helmet
        title={`${postTitle} | ${siteTitle}`}
        meta={[
          { name: 'description', content: postDescription },
          { name: 'keywords', content: post.frontmatter.keywords || 'husain, robotics, gaming' },
          { property: 'og:title', content: postTitle },
          { property: 'og:description', content: postDescription },
          { property: 'og:type', content: 'article' },
          { property: 'og:url', content: postUrl },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: postTitle },
          { name: 'twitter:description', content: postDescription },
        ]}
      >
        <html lang="en" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="shortcut icon" href="/favicon-48x48.png" />
      </Helmet>
      <article
        className="active blog-post"
        itemScope
        itemType="http://schema.org/Article"
        style={{ margin: `3rem auto`, padding: `10px` }}
      >
      <a href="/" >Home</a>
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
        </footer>
      </article>
    </Layout>
    
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $slug: String!
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        keywords
      }
    }
  }
`
