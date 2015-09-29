import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Panel } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'

function select (state) {
  return { contacts: state.cv.contacts}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('contacts'), dispatch)
    }
  }
}

@connect(select, actions)
export default class Contact extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'contacts')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('contacts'))
    }
  }

  isFetched () {
    return this.props.contacts.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      setTimeout( () => {
        this.props.actions.fetchState()
      }, 2000)

    }
  }

  render () {
    const content = (
      <Panel header='// CONTACTS'>
        <p>{this.props.contacts}</p>
      </Panel>
    )

    return (
      <div data-class='CV.Contact'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}
