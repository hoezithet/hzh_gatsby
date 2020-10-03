import React from "react";
import PropTypes from 'prop-types'
import { Link } from 'gatsby-theme-material-ui'

const MarkdownLink = ({ href, ...rest }) => {
  if (!href.startsWith('http')) {
    return <Link to={href} {...rest} />
  }

  return (
    <Link
      href={href}
      {...rest}
    />
  )
}

MarkdownLink.propTypes = {
  href: PropTypes.string.isRequired,
}

export default MarkdownLink