'use strict'

const React = require('react')
// import _ from 'lodash'
//
// import hashHistory from 'react-router'
// import initStore from '../../src/front-end/js/store'
// import initRouter from '../../src/front-end/js/router'
const _ = require('lodash')

const { hashHistory } = require('react-router')
const initStore = require('../../src/front-end/js/store')
const initRouter = require('../../src/front-end/js/router')

const pkg = require(process.cwd() + '/package.json')

function reduxHandler (req, res, next) {
  let initialState = {
    application: {
      token: null,
      user: null,
      nextTransitionPath: req.query.targetPath || ''
    },
    cv: {}
  }

  if (_.result(req, 'session.user')) {
    initialState.application = _.merge(initialState.application, {
      token: req.cookies.token,
      user: req.session.user
    })
  }

  global.INITIAL_STATE = JSON.stringify(initialState)
  let store = initStore()
  global.RESPONSE = res

  initRouter(hashHistory, store)
    .then(({content}) => {
      const html = React.renderToString(content)
      var opts = {
        title: pkg.name,
        author: pkg.author,
        description: pkg.description,
        version: pkg.version,
        keywords: pkg.keywords.join(', '),
        html: html,
        initialState: JSON.stringify(initialState)
      }
      if (!res.headersSent) {
        res.render('index', opts)
      }
    })
    .catch((err) => {
      console.error(err)
      next(err)
    })
}

module.exports = (app) => app.get('/app*', reduxHandler)
