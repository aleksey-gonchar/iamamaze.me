import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Panel } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'

function select (state) {
  return { hobbies: state.cv.hobbies}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('hobbies'), dispatch)
    }
  }
}

@connect(select, actions)
export default class Hobbies extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'hobbies')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('hobbies'))
    }
  }

  isFetched () {
    return this.props.hobbies.length > 0
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
      <Panel header={(<h2>// HOBBIES</h2>)}>
        <p>{this.props.hobbies}</p>
      </Panel>
    )

    return (
      <div data-class='CV.Hobbies'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}
