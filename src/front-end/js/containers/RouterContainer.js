import React from 'react'
import { Router } from 'react-router'
import * as AppActions from '../actions/AppActions.js'

export default class RouterContainer extends React.Component {
  static requireAuth (store) {
    var appStore = store

    return (nextState, transition) => {
      const { isLoggedIn } = appStore.getState().application

      if (!isLoggedIn) {
        const targetPath = nextState.location.pathname
        appStore.dispatch(AppActions.rememberTransition(targetPath))
        appStore.dispatch(AppActions.gotoLogin(transition))
      }
    }
  }

  render () {
    return (<Router {...this.props} />)
  }
}
