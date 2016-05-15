import React from 'react'
import createFragment from 'react-addons-create-fragment'
import { isFetched } from '../../reducers/CVReducer.js'
import CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'node-uuid'

import { Panel } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'

function select (state) {
  return { hobbies: state.cv.hobbies}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('hobbies'), dispatch)
    }
  }
}

class Hobbies extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'hobbies')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('hobbies'))
    }
  }

  isFetched () {
    return this.props.hobbies.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      this.props.actions.fetchState()
    }
  }

  render () {
    let hobbies = []

    if (this.isFetched()) {
      hobbies = _.reduce(this.props.hobbies, (res, hobby) => {
        const el = (
          <li className='cv-hobby' key={uuid.v4()}>
            <Icon fw name='heart' className='cv-hobby-icon'/>
            <div className='cv-hobby-title'>{hobby}</div>
          </li>
        )
        res[el.key]= el
        return res
      }, {})

      hobbies = createFragment(hobbies)
    }

    const content = (
      <Panel header={(<h2>// HOBBIES</h2>)}>
        <ul className='cv-hobbies'>{hobbies}</ul>
      </Panel>
    )

    return (
      <div data-class='CV.Hobbies'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}

export default connect(select, actions)(Hobbies)