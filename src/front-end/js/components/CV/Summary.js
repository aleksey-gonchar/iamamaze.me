import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Panel } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'

function select (state) {
  return { summary: state.cv.summary}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('summary'), dispatch)
    }
  }
}

@connect(select, actions)
export default class Summary extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'summary')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('summary'))
    }
  }

  isFetched () {
    return this.props.summary.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      this.props.actions.fetchState()
    }
  }

  render () {
    const content = (
      <Panel header={(<h2>// SUMMARY</h2>)}>
        <p>{this.props.summary}</p>
      </Panel>
    )

    return (
      <div data-class='CV.Summary'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}
