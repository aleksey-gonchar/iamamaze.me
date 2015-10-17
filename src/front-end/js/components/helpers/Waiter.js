import React from 'react'

import { Icon } from './FontAwesome.js'

export default class Waiter extends React.Component {
  render () {
    return (
      <div data-class='Waiter'>
        <div className='waiter-content'>
          <Icon name='circle-o-notch' spin />
          </div>
        </div>
    )
  }
}
