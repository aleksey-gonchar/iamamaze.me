import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'

export default class Hobbies extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'hobbies')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('hobbies'))
    }
  }

  render () {
    return (
      <div data-class='CV.Hobbies'>
        <p>`Hobbies` content pending</p>
      </div>
    )
  }
}
