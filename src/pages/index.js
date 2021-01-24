import React, { useState } from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const allSongs = data.allMarkdownRemark.edges

  const emptyQuery = ""

  const [state, setState] = useState({
    filteredData: [],
    query: emptyQuery,
  })

  const handleInputChange = event => {
    const query = event.target.value

    const songs = data.allMarkdownRemark.edges || []

    const filteredData = songs.filter(song => {
      const { title } = song.node.frontmatter
      return (
        title.toLowerCase().includes(query.toLowerCase())
      )
    })

    setState({
      query,
      filteredData,
    })
  }

  const { filteredData, query } = state
  const hasSearchResults = filteredData && query !== emptyQuery
  const songs = hasSearchResults ? filteredData : allSongs

  if (songs.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <SEO title="All posts" />
        <input
          type="text"
          aria-label="Search"
          placeholder="Szukaj..."
          onChange={handleInputChange}
          className="search-input"
        />
        <p style={{ marginTop: 20 }}>
          Songs not found
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <input
        type="text"
        aria-label="Search"
        placeholder="Szukaj..."
        onChange={handleInputChange}
        className="search-input"
      />
      <ol style={{ listStyle: `none` }}>
        {songs.map(({ node }) => {
          const { excerpt } = node
          const { slug } = node.fields
          const { title, date, description } = node.frontmatter

          return (
            <li key={slug}>
              <article>
                <header>
                  <h2>
                    <Link to={slug}>{title}</Link>
                  </h2>
                  <p>{date}</p>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: description || excerpt,
                    }}
                  />
                </section>
                </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(pruneLength: 200)
          id
          frontmatter {
            title
            description
            date(formatString: "MMMM DD, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
