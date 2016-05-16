import React from 'react'
import createFragment from 'react-addons-create-fragment'
import { isFetched } from '../../reducers/CVReducer.js'
import CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import $ from 'jquery'

import { Panel, OverlayTrigger, Popover } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'
import uuid from 'node-uuid'
import marked from 'marked'


//require('../../helpers/draggable.js')

function select (state) {
  return {
    skills: state.cv.skills,
    skillsLastUpdated: state.cv.skillsLastUpdated
  }
}

function actions (dispatch) {
  return {
    actions: {
      fetchStateSkills: bindActionCreators(() => CVActions.fetchState('skills'), dispatch),
      fetchStateSkillsLastUpdated: bindActionCreators(() => CVActions.fetchState('skills-last-updated'), dispatch)
    }
  }
}

class Skills extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'skills')) {
      return Promise.resolve()
    } else {
      return [
        store.dispatch(CVActions.fetchState('skills')),
        store.dispatch(CVActions.fetchState('skills-last-updated')),
      ]
    }
  }

  isFetched () {
    return this.props.skills.length > 0 && this.props.skillsLastUpdated.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      this.props.actions.fetchStateSkills()
      this.props.actions.fetchStateSkillsLastUpdated()
    }
  }

  render () {
    let skills = []

    if (this.isFetched()) {
      skills = _.chain(this.props.skills).reduce((res, skill) => {
        let comment = null

        if (!_.isEmpty(skill.comment)) {
          comment = (
            <div>
              <strong>Comment:</strong> {skill.comment}
            </div>
          )
        }

        const popover = (
          <Popover>
            <strong>Years</strong>: {skill.years}
            {comment}
          </Popover>
        )

        const disabled = skill.active ? '' : 'disabled'
        const idOrKey = uuid.v4()
        const el = (
          <li className={`cv-skill ${disabled}`} key={idOrKey}
              style={{ width: `${skill.size}px`, height: `${skill.size}px`,
                       top: skill.top, left: skill.left
                    }}>
            <OverlayTrigger placement='bottom' overlay={popover} >
              <div className='cv-skill-title'
                   style={{ height: 'inherit', fontSize: skill.fontSize }}
                   dangerouslySetInnerHTML={ {__html: marked(skill.title)} }/>
            </OverlayTrigger>
          </li>
        )
        res[el.key]= el
        return res
      }, {}).value()

      skills = createFragment(skills)
    }

    const content = (
      <Panel header={(<h2>// SKILLS</h2>)}>
        <ul className='cv-skills clearfix'>
          {skills}
        </ul>
        <div className='pull-right' style={{ color:'darkgrey' }}>
          Last updated: {this.props.skillsLastUpdated}
        </div>
      </Panel>
    )

    return (
      <div data-class='CV.Skills'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}

export default connect(select, actions)(Skills)