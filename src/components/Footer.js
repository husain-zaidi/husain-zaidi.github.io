import React from 'react'
import PropTypes from 'prop-types'

const Footer = (props) => (
    <footer id="footer" style={props.timeout ? {display: 'none'} : {}}>
       Do not quit, stay humble, just do things.
    </footer>
)

Footer.propTypes = {
    timeout: PropTypes.bool
}

export default Footer
