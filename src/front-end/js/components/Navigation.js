import React from 'react'
import { Link } from 'react-router'

import { Nav, Navbar, CollapsibleNav } from 'react-bootstrap'
import { NavItemLink } from 'react-router-bootstrap'

NavItemLink.contextTypes = Object.assign(NavItemLink.contextTypes, {
  router: React.PropTypes.object
})

export default class Navigation extends React.Component {
  render () {
    return (
      <Navbar fixedtop fluid toggleNavKey={0}>
        <div className='navbar-header'>
          <span className='navbar-brand'>
            <Link to='/app'>My brand name</Link>
          </span>
        </div>
        <Nav navbar>
          <NavItemLink to='/app/about'>ABOUT</NavItemLink>
          <NavItemLink to='/app/cv'>CV</NavItemLink>
          <NavItemLink to='/app/hire-me'>HIRE ME</NavItemLink>
        </Nav>
      </Navbar>
    )
  }
}
