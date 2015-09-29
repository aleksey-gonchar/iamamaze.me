import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'

export default class Summary extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'summary')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('summary'))
    }
  }

  render () {
    return (
      <div data-class='CV.Summary'>
        <p>`Summary` content pending</p>
      </div>
    )
  }
}
