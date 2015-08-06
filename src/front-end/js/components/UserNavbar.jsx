/* global React */
let { Nav } = RB
let { NavItemLink } = RRB

export default React.createClass({
  displayName: 'UserNavbar',

  render () {
    return (
      <Nav navbar right>
        <NavItemLink to='login'>Log in</NavItemLink>
        <NavItemLink to='sign-up'>Sign up</NavItemLink>
      </Nav>
    )
  }
})

