import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'

export default class Projects extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'projects')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('projects'))
    }
  }

  render () {
    return (
      <div data-class='CV.Projects'>
        <p>`Projects` content pending</p>
      </div>
    )
  }
}
