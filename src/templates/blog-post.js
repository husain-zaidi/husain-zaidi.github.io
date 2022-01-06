import * as React from "react"
import Helmet from 'react-helmet'
import { graphql } from "gatsby"
import '../assets/scss/main.scss'

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Blog`

  return (
    <>
     <Helmet
        title={siteTitle}
        meta={[
          { name: 'description', content: 'Blog' },
          { name: 'keywords', content: 'sample, something' },
        ]}
      >
        <html lang="en" />
      </Helmet>
      <article
        className="active"
        itemScope
        itemType="http://schema.org/Article"
        style={{ margin: `3rem auto`, padding: `10px`, maxWidth: 600 }}
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
    </>
    
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
      }
    }
  }
`