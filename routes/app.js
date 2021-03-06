'use strict'
const _ = require('lodash')
const pkg = $require('package.json')

let renderApp = _.curry((app, req, res, next) => {
  let initialState = {
    application: {
      token: null,
      user: null,
      nextTransitionPath: req.query.targetPath || ''
    },
    cv: {}
  }

  if (_.result(req, 'session.user')) {
    initialState.application = _.extend(initialState.application, {
      token: req.cookies.token,
      user: req.session.user
    })
  }

  const opts = {
    title: pkg.name,
    author: pkg.author,
    description: pkg.description,
    version: pkg.version,
    keywords: pkg.keywords.join(', '),
    // html: html,
    initialState: JSON.stringify(initialState)
  }

  if (!res.headersSent) {
    res.template = 'index'
    res.opts = opts
    next()
  } else {
    next()
  }
})

module.exports = app => app.get('/app/*', renderApp(app))
