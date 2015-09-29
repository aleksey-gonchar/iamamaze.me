import notify from '../helpers/notify.js'
import { createAction } from 'redux-actions'
import constants from '../constants.js'

const { FETCH_CV_STATE } = constants.cv

function fetchState (section) {
  return (dispatch) => {
    return {
      type: FETCH_CV_STATE,
      payload: `/cv/${section}`
    }
  }
}

export default {
  fetchState: fetchState
}
