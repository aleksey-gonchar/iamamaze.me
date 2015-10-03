import React from 'react'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'node-uuid'

import Project from './Project.js'
import { Panel } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'

function select (state) {
  return { projects: state.cv.projects}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('projects'), dispatch)
    }
  }
}

@connect(select, actions)
export default class Projects extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'projects')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('projects'))
    }
  }

  isFetched () {
    return this.props.projects.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      this.props.actions.fetchState()
    }
  }

  render () {
    let projects = []

    if (this.isFetched()) {
      projects = _.reduce(this.props.projects, (res, project) => {
        const el = (<Project project={project} key={uuid.v4()} />)
        res[el.key]= el
        return res
      }, {})

      projects = React.addons.createFragment(projects)
    }

    const content = (
      <Panel header={(<h2>// 5 LARGE PROJECTS THAT CAUSES PRIDE</h2>)}>
        <ul className='cv-projects'>{projects}</ul>
      </Panel>
    )

    return (
      <div data-class='CV.Projects'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}