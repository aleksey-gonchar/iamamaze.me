import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Panel } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'

function select (state) {
  return { skills: state.cv.skills}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('skills'), dispatch)
    }
  }
}

@connect(select, actions)
export default class Skills extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'skills')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('skills'))
    }
  }

  isFetched () {
    return this.props.skills.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      this.props.actions.fetchState()
    }
  }

  render () {
    const content = (
      <Panel header={(<h2>// SKILLS</h2>)}>
        <p>{this.props.skills}</p>
      </Panel>
    )

    return (
      <div data-class='CV.Skills'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}
