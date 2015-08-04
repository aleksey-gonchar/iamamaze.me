/* global React */
export default React.createClass({
  displayName: 'TopNavbar',

  render () {
    return (
      <RB.Navbar brand='My brand name' fixedtop>
        <RB.Nav navbar>
          <RB.NavItem eventKey={1} href='#'>Link</RB.NavItem>
        </RB.Nav>
        <RB.Nav navbar right>
          <RB.NavItem eventKey={1} href='#'>Log in</RB.NavItem>
          <RB.NavItem eventKey={1} href='#'>Sign up</RB.NavItem>
        </RB.Nav>
      </RB.Navbar>
    )
  }
})
