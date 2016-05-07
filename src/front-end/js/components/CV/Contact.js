import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'node-uuid'

import { Panel } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'

function select (state) {
  return { contacts: state.cv.contacts}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('contacts'), dispatch)
    }
  }
}

class Contact extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'contacts')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('contacts'))
    }
  }

  isFetched () {
    return this.props.contacts.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      this.props.actions.fetchState()
    }
  }

  render () {
    let contacts = []

    if (this.isFetched()) {
      contacts = _.reduce(this.props.contacts, (res, contact) => {
        let link = null
        if (!_.isEmpty(contact.link)) {
          link = (
            <div className='cv-contact-link'>
              <input type='text' disabled value={contact.link}/>
            </div>
          )
        }

        const el = (
          <li className='cv-contact' key={uuid.v4()}>
            <div className='cv-contact-icon'><Icon name={contact.icon}/></div>
            <div className='cv-contact-details'>
              <div className='cv-contact-title'>{contact.title}</div>
              {link}
            </div>
          </li>
        )
        res[el.key]= el
        return res
      }, {})

      contacts = React.addons.createFragment(contacts)
    }

    const content = (
      <Panel header={(<h2>// CONTACTS</h2>)}>
        <ul className='cv-contacts'>{contacts}</ul>
      </Panel>
    )

    return (
      <div data-class='CV.Contact'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}

export default connect(select, actions)(Contact)
