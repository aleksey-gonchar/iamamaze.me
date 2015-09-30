import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Panel } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'

function select (state) {
  return { languages: state.cv.languages}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('languages'), dispatch)
    }
  }
}

@connect(select, actions)
export default class Languages extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'languages')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('languages'))
    }
  }

  isFetched () {
    return this.props.languages.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      this.props.actions.fetchState()
    }
  }

  render () {
    const content = (
      <Panel header={(<h2>// LANGUAGES</h2>)}>
        <p>{this.props.languages}</p>
      </Panel>
    )

    return (
      <div data-class='CV.Languages'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}
