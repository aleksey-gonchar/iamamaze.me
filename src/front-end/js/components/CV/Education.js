import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Panel } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'

function select (state) {
  return { education: state.cv.education}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('education'), dispatch)
    }
  }
}

@connect(select, actions)
export default class Education extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'education')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('education'))
    }
  }

  isFetched () {
    return this.props.education.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      this.props.actions.fetchState()
    }
  }

  render () {
    const content = (
      <Panel header={(<h2>// EDUCATION</h2>)}>
        <p>{this.props.education}</p>
      </Panel>
    )

    return (
      <div data-class='CV.Education'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}
