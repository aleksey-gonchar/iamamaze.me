import Component from './Component.jsx'
import ModalActions from '../actions/ModalActions.js'

let { Nav, NavItem } = RB
let { NavItemLink } = RRB

class UserNavbar extends Component {
  constructor(props) {
    super(props)
    this.actions = ModalActions
  }
  render () {
    return (
      <Nav navbar right>
        <NavItem onClick={this.actions.show('login')}>Log in</NavItem>
        <NavItem onClick={this.actions.show('sign-up')}>Sign up</NavItem>
      </Nav>
    )
  }
}

export default UserNavbar