import React from 'react'
import { Link } from 'react-router'
import $ from 'jquery'

import { Nav, Navbar, CollapsibleNav } from 'react-bootstrap'
import { NavItemLink } from 'react-router-bootstrap'
import { Icon } from './helpers/FontAwesome.js'

NavItemLink.contextTypes = Object.assign(NavItemLink.contextTypes, {
  router: React.PropTypes.object
})


export default class Navigation extends React.Component {
  componentDidMount () {
    const navbarMenu = $('[data-class="Navigation"] .navbar-menu')
    const navbarNav = $('[data-class="Navigation"] .navbar-nav')

    window.onscroll= () => {
      if (document.body.scrollTop > 108) {
        navbarMenu.addClass('solid-bg')
        navbarNav.addClass('light-links')
      } else {
        navbarMenu.removeClass('solid-bg')
        navbarNav.removeClass('light-links')
      }
    }
  }

  render () {
    const socials = (
      <div className='navbar-social'>
        <a href='http://telegram.me/tuiteraz'>
          <span className='fa-stack fa-lg'>
            <i className='fa fa-circle fa-stack-2x fa-inverse'/>
            <i className='fa fa-paper-plane fa-stack-1x'/>
          </span>
        </a>
        <a href='https://fb.com/gonchara.net'>
          <span className='fa-stack fa-lg'>
            <i className='fa fa-circle fa-stack-2x fa-inverse'/>
            <i className='fa fa-facebook fa-stack-1x'/>
          </span>
        </a>
        <a href='https://ua.linkedin.com/in/alekseygonchar'>
          <span className='fa-stack fa-lg'>
            <i className='fa fa-circle fa-stack-2x fa-inverse'/>
            <i className='fa fa-linkedin fa-stack-1x'/>
          </span>
        </a>
        <a href='https://github.com/aleksey-gonchar'>
          <span className='fa-stack fa-lg'>
            <i className='fa fa-circle fa-stack-2x fa-inverse'/>
            <i className='fa fa-github-alt fa-stack-1x'/>
          </span>
        </a>
      </div>
    )

    return (
      <Navbar fixedtop fluid data-class='Navigation'>
        <div className='navbar-header'>
          <div className='navbar-avatar'>
            <Link to='/app/about'>
              <img src='/public/images/avatars/budva.jpg' />
            </Link>
          </div>
          <div className='navbar-titles'>
            <div className='navbar-titles-container'>
              <Link to='/app/about' className='navbar-name'>
                <h2>Alex Potter</h2>
              </Link>
              <span className='navbar-sub-title'>full stack js developer</span>
              {socials}
            </div>
          </div>
        </div>
        <div className='navbar-menu'>
          <Nav navbar>
            <NavItemLink to='/app/about'>ABOUT</NavItemLink>
            <NavItemLink to='/app/cv'>CV</NavItemLink>
            <NavItemLink to='/app/hire-me'>HIRE ME</NavItemLink>
          </Nav>
        </div>
      </Navbar>
    )
  }
}
