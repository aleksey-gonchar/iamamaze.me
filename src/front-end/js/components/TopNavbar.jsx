/* global React */
import UserNavbar from './UserNavbar.jsx'

export default React.createClass({
  displayName: 'TopNavbar',

  render () {
    return (
      <RB.Navbar brand='My brand name' fixedtop fluid inverse>
        <RB.Nav navbar>
          <RB.NavItem eventKey={1} href='#'>Link</RB.NavItem>
        </RB.Nav>
        <UserNavbar />
      </RB.Navbar>
    )
  }
})
