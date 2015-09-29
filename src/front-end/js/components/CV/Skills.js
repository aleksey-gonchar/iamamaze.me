import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'

export default class Skills extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'skills')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('skills'))
    }
  }

  render () {
    return (
      <div data-class='CV.Skills'>
        <p>`Skills` content pending</p>
      </div>
    )
  }
}
