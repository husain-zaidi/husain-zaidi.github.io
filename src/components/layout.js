import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import '../assets/scss/main.scss'

const Layout = ({ children, location, pageClassName = '' }) => {

  let content;

  if (location && location.pathname === '/') {
    content = (
      <div>
        {children}
      </div>
    )
  } else {
    content = (
      <div id="wrapper" className={`page ${pageClassName}`.trim()}>
        <div>
          {children}
        </div>
      </div>
    )
  }

  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => (
        <>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: 'description', content: 'Husain Zaidi, Software Developer expert in LLM, robotics' },
              { name: 'keywords', content: 'Husain Zaidi, Microsoft, robotics, LLM, Gaming, software' },
            ]}
          >
            <html lang="en" />
            <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
            <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
            <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png" />
            <link rel="shortcut icon" href="/favicon-48x48.png" />
          </Helmet>
          {content}
        </>
      )}
    />
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  pageClassName: PropTypes.string,
}

export default Layout
