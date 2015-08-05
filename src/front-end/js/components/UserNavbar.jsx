/* global React */
export default React.createClass({
  displayName: 'UserNavbar',

  render () {
    return (
      <RB.Nav navbar right>
        <RB.NavItem eventKey={1} href='#'>Log in</RB.NavItem>
        <RB.NavItem eventKey={1} href='#'>Sign up</RB.NavItem>
      </RB.Nav>
    )
  }
})
