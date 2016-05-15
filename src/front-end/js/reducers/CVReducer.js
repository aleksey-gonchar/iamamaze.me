import { handleActions } from 'redux-actions'
import _ from 'lodash'
import _s from 'underscore.string'
import constants from '../constants.js'
import notify from '../helpers/notify.js'
import $ from 'jquery'

const { FETCH_CV_STATE } = constants.cv

function fetchStateRequest (state, action) {
  return Object.assign({}, state)
}

function fetchStateSuccess (state, action) {
  let newState = Object.assign({}, state)
  newState[_s.camelize(action.meta.section)] = action.payload
  return newState
}

function fetchStateError (state, action) {
  notify.error(action.payload)
  return state
}
/*
  @param {Object} store - appStore.cv
 */
export function isFetched (store, section) {
  const state = store
  if (state) {
    switch(typeof state[section]) {
      case 'string': return state[section].length > 0; break
      case 'array': return state[section].length > 0; break
      case 'object': return _.keys(state[section]).length > 0; break
      default: return false
    }
  } else {
    return true
  }
}

export default () => {
  let data = _.result(window, 'INITIAL_STATE.cv')

  const initialState = _.defaultsDeep(data, {
    summary: '',
    contacts: [],
    languages: [],
    hobbies: [],
    education: [],
    skills: [],
    skillsLastUpdated: '',
    projects: []
  })

  return handleActions({
    [FETCH_CV_STATE.REQUEST]: fetchStateRequest,
    [FETCH_CV_STATE.SUCCESS]: fetchStateSuccess,
    [FETCH_CV_STATE.ERROR]: fetchStateError
  }, initialState)
}


