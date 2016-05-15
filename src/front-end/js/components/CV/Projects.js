import React from 'react'
import createFragment from 'react-addons-create-fragment'
import { isFetched } from '../../reducers/CVReducer.js'
import CVActions from '../../actions/CVActions.js'
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

class Projects extends React.Component {
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

      projects = createFragment(projects)
    }

    const content = (
      <Panel header={(<h2>// 5 LARGE PROJECTS THAT CAUSES PRIDE</h2>)}>
        <ul className='cv-projects clearfix'>{projects}</ul>
      </Panel>
    )

    return (
      <div data-class='CV.Projects'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}

export default connect(select, actions)(Projects)