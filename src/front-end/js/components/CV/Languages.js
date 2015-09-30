import React from 'react/addons'
import { isFetched } from '../../reducers/CVReducer.js'
import * as CVActions from '../../actions/CVActions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import marked from 'marked'
import uuid from 'node-uuid'

import { Panel, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Icon } from '../helpers/FontAwesome.js'
import Waiter from '../helpers/Waiter.js'

function select (state) {
  return { languages: state.cv.languages}
}

function actions (dispatch) {
  return {
    actions: {
      fetchState: bindActionCreators(() => CVActions.fetchState('languages'), dispatch)
    }
  }
}

@connect(select, actions)
export default class Languages extends React.Component {
  static fetchState (store) {
    if (isFetched(store.getState().cv, 'languages')) {
      return Promise.resolve()
    } else {
      return store.dispatch(CVActions.fetchState('languages'))
    }
  }

  isFetched () {
    return this.props.languages.length > 0
  }

  componentDidMount () {
    if (!this.isFetched()) {
      this.props.actions.fetchState()
    }
  }

  render () {
    let languages = []

    if (this.isFetched()) {
      const star = (<Icon fw name='star'/>)
      const starEmpty = (<Icon fw name='star-o'/>)

      languages = _.reduce(this.props.languages, (res, language) => {
        const tooltip = (
          <Tooltip>
            <div dangerouslySetInnerHTML={ {__html: marked(language.comment)} }
                 style={{ textAlign: 'left'}}
              />
          </Tooltip>
        )

        let stars = _.fill(Array(5), star, 0, language.rating+1)
        stars = _.fill(stars, starEmpty, language.rating, 5)
        const el = (
          <li className='cv-language' key={uuid.v4()}>
            <div className='cv-language-title'>{language.title}</div>
            <div className='cv-language-details'>
              <div className='cv-language-rating'>
                <OverlayTrigger placement='left' overlay={tooltip}>
                  <div>{stars}</div>
                </OverlayTrigger>
              </div>
            </div>
          </li>
        )
        res[el.key] = el
        return res
      }, {})

      languages = React.addons.createFragment(languages)
    }

    const content = (
      <Panel header={(<h2>// LANGUAGES</h2>)}>
        <ul className='cv-languages'>{languages}</ul>
      </Panel>
    )

    return (
      <div data-class='CV.Languages'>
        { this.isFetched() ? content: <Waiter/> }
      </div>
    )
  }
}
