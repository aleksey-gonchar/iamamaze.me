/* global React */
let { Nav } = RB
let { NavItemLink } = RRB

import ModalActions from '../actions/ModalActions.js'

export default React.createClass({
  displayName: 'UserNavbar',

  render () {
    return (
      <Nav navbar right>
        <NavItem onClick={ModalAction.show('login')}>Log in</NavItem>
        <NavItem onClick={ModalAction.show('sign-up')}>Sign up</NavItem>
      </Nav>
    )
  }
})
