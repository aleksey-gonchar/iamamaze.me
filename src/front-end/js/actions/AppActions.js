import notify from '../helpers/notify.js'
import request from 'superagent'
import _ from 'lodash'
import { createAction } from 'redux-actions'
import constants from '../constants.js'
import 'isomorphic-fetch'
import shake from '../helpers/shake'

const {
        GOTO_INDEX, GOTO_LOGIN, LOG_IN, LOG_OUT, SIGN_UP,
        REMEMBER_TRANSITION, FULFILL_TRANSITION,
        REMEMBER_ROUTER, DISCARD_NEXT_TRANSITION, FETCH_APP_STATE
      } = constants.application

function logIn (user) {
  return {
    type: LOG_IN,
    payload: user
  }
}

function makeLogInRequest (payload) {
  return (dispatch, getState) => {
    const credentials = _.pick(_.result(payload, 'credentials'), ['email', 'password'])

    request.post('/api/users/log-in')
      .set('Content-Type', 'application/json')
      .send(credentials)
      .end((err, res) => {
        if (err) {
          if (err.status !== 401) { notify.error(err) }
          return shake(payload.shake)
        }

        dispatch(logIn(res.body))

        const nextPath = getState().application.nextTransitionPath
        if (nextPath) {
          dispatch(fulfillTransition())
        } else {
          dispatch(gotoIndex())
        }
      })
  }
}

function logOut () {
  return { type: LOG_OUT }
}

function makeLogOutRequest () {
  return (dispatch) => {
    request.post('/api/users/log-out')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) { return notify.error(err) }

        dispatch(logOut())
      })
  }
}

function signUp () {
  return { type: SIGN_UP }
}

function makeSignUpRequest (payload) {
  const user = _.pick(_.result(payload, 'user'), ['firstName', 'lastName', 'email', 'password'])

  return (dispatch) => {
    request.post('/api/users/register')
      .send(user)
      .end((err, res) => {
        if (err) {
          notify.error(res.body)
          return shake(payload.shake)
        }

        dispatch(signUp())
        dispatch(gotoIndex())
      })
  }
}

function fulfillTransition (nextPath) {
  return {
    type: FULFILL_TRANSITION,
    payload: nextPath
  }
}

function rememberTransition (nextPath) {
  return {
    type: REMEMBER_TRANSITION,
    payload: nextPath
  }
}

function requestAuth (nextPath) {
  return (dispatch) => {
    dispatch(rememberTransition(nextPath))
    dispatch(gotoLogin())
  }
}

function fetchState () {
  return {
    type: FETCH_APP_STATE,
    payload: '/users/current'
  }
}

function gotoIndex (transition=null) {
  return {
    type: GOTO_INDEX,
    payload: transition
  }
}

function gotoLogin (transition=null) {
  return {
    type: GOTO_LOGIN,
    payload: transition
  }
}

export default {
  logIn: makeLogInRequest,
  logOut: makeLogOutRequest,
  rememberRouter: createAction(REMEMBER_ROUTER),
  signUp: makeSignUpRequest,
  requestAuth: requestAuth,
  rememberTransition: rememberTransition,
  fulfillTransition: fulfillTransition,
  discardNextTransition: createAction(DISCARD_NEXT_TRANSITION),
  fetchState: fetchState,
  gotoIndex: gotoIndex,
  gotoLogin: gotoLogin
}
