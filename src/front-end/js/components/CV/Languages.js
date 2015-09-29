import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'

export default class Languages extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'languages')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('languages'))
    }
  }

  render () {
    return (
      <div data-class='CV.Languages'>
        <p>`Languages` content pending</p>
      </div>
    )
  }
}
