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
      <Navbar fixedtop fluid data-class='Navigation'>
        <div className='navbar-header'>
          <Link to='/app/about'>
            <img src='/public/images/avatars/budva.jpg' className='navbar-avatar'/><br/>
            <h2>Alex Potter</h2>
          </Link>
          <br/>
          <span className='navbar-sub-title'>full stack javascript developer</span>
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
