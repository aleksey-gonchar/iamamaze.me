import React from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'react'
import ModalsContainer from './ModalsContainer.js'
import * as AppActions from '../actions/AppActions.js'
import { isFetched } from '../reducers/AppReducer.js'
import { bindActionCreators } from 'redux'

function select (state) {
  return { application: state.application }
}

function actions (dispatch) {
  return {
    actions: {
      rememberRouter: bindActionCreators(AppActions.rememberRouter, dispatch)
    }
  }
}

@connect(select, actions)
export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    actions: PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.any
  }

  static fetchState (store, params, query) {
    if (isFetched(store.getState())) {
      return Promise.resolve()
    } else {
      return Promise.all([store.dispatch(AppActions.fetchState(params, query))])
    }
  }

  componentDidMount () {
    this.props.actions.rememberRouter(this.context.router)
  }

  render () {
    return (
      <div id='app'>
        {this.props.children}
        <ModalsContainer />
      </div>
    )
  }
}
