import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'

export default class Contact extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState(), 'contacts')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('contacts'))
    }
  }

  render () {
    return (
      <div data-class='CV.Contact'>
        <p>`Contact` content pending</p>
      </div>
    )
  }
}
