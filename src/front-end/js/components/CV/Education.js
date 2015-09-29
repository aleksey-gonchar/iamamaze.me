import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'

export default class Education extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState(), 'education')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('education'))
    }
  }

  render () {
    return (
      <div data-class='CV.Education'>
        <p>`Education` content pending</p>
      </div>
    )
  }
}
