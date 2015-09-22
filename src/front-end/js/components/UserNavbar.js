import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions.js'
import _ from 'lodash'

import { Nav, DropdownButton, MenuItem } from 'react-bootstrap'
import { NavItemLink } from 'react-router-bootstrap'

function select (state) {
  return {
    application: state.application,
    modals: state.modals
  }
}

function actions (dispatch) {
  return {
    actions: {
      logOut: bindActionCreators(AppActions.logOut, dispatch)
    }
  }
}

@connect(select, actions)
export default class UserNavbar extends React.Component {
  static propTypes = {
    application: React.PropTypes.object.isRequired,
    modals: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  }

  render () {
    const { application, actions } = this.props
    const { user } = application

    if (!_.isNull(user)) {
      let fullName = `${user.firstName} ${user.lastName}`
      let title = (
        <span className='user-pic'>
          <img src='/public/images/avatar-flat-man-1.png'/>
          {fullName}
        </span>
      )

      return (
        <Nav data-class='UserNavbar' navbar right >
          <DropdownButton title={title}>
            <MenuItem onSelect={actions.logOut}>Logout</MenuItem>
          </DropdownButton>
        </Nav>
      )
    } else {
      return (
        <Nav data-class='UserNavbar' navbar right >
          <NavItemLink to='/app/login'>Log in</NavItemLink>
          <NavItemLink to='/app/registration'>Sign up</NavItemLink>
        </Nav>
      )
    }
  }
}

