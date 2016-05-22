import React from 'react'
import createFragment from 'react-addons-create-fragment'
import { isFetched } from '../../reducers/CVReducer.js'
import CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'node-uuid'
import marked from 'marked'

import { Panel, Table } from 'react-bootstrap'
import Waiter from '../helpers/Waiter.js'

function select (state) {
  return { education: state.cv.education}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('education'), dispatch)
    }
  }
}

class Education extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'education')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('education'))
    }
  }

  isFetched () {
    return this.props.education.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      this.props.actions.fetchState()
    }
  }

  render () {
    let education = []

    if (this.isFetched()) {
      education = _.chain(this.props.education).sortBy('year').reverse().reduce((res, edu) => {
        const el = (
          <li className='cv-education-item' key={uuid.v4()}>
            <div className='cv-education-item-year'>
              {edu.year}
            </div>
            <div className='cv-education-item-text'>
              <strong>{edu.title}</strong>
              <span className='cv-edu-details' dangerouslySetInnerHTML={ {__html: marked(edu.details)} }/>
            </div>
          </li>
        )
        res[el.key]= el
        return res
      }, {}).value()

      education = createFragment(education)
    }

    const content = (
      <Panel header={(<h2>// EDUCATION</h2>)}>
        <ul className='cv-education clearfix'>
          {education}
        </ul>

      </Panel>
    )

    return (
      <div data-class='CV.Education'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}

export default connect(select, actions)(Education)