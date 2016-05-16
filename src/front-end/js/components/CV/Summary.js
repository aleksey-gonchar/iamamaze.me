import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import marked from 'marked'

import { Panel } from 'react-bootstrap'
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

class Summary extends React.Component {
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
        <div dangerouslySetInnerHTML={ {__html: marked(this.props.summary)} }/>
      </Panel>
    )

    return (
      <div data-class='CV.Summary'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}

export default connect(select, actions)(Summary)
