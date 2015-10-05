import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Panel } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'
import uuid from 'node-uuid'
import marked from 'marked'

if (__CLIENT__) {
  const $ = require('jquery')
  require('../../helpers/draggable.js')
}

function select (state) {
  return { skills: state.cv.skills}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('skills'), dispatch)
    }
  }
}

@connect(select, actions)
export default class Skills extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'skills')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('skills'))
    }
  }

  isFetched () {
    return this.props.skills.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      this.props.actions.fetchState()
    }
    $('.cv-skill').drags()
  }

  render () {
    let skills = []

    if (this.isFetched()) {
      skills = _.chain(this.props.skills).reduce((res, skill) => {
        const disabled = skill.active ? '' : 'disabled'
        const el = (
          <li className={`cv-skill ${disabled}`} key={uuid.v4()}
              style={{ width: `${skill.size}px`, height: `${skill.size}px`,
                       top: `${skill.top}px`, left: `${skill.left}px`
                    }}>
            <div className='cv-skill-title'
                 style={{ height: 'inherit', fontSize: skill.fontSize }}
                 dangerouslySetInnerHTML={ {__html: marked(skill.title)} }/>
          </li>
        )
        res[el.key]= el
        return res
      }, {}).value()

      skills = React.addons.createFragment(skills)
    }

    const content = (
      <Panel header={(<h2>// SKILLS</h2>)}>
        <ul className='cv-skills clearfix'>
          {skills}
        </ul>
      </Panel>
    )

    return (
      <div data-class='CV.Skills'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}
