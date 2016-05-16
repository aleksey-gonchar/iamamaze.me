'use strict'

const express = require('express')
const apiRouter = express.Router()

const serverCfg = $requireConfig('server')

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.redirect('/app/about')
  })

  app.get('/app', (req, res) => {
    res.redirect('/app/about')
  })
  require('./app')(app)

  require('./auth/jwt')(app) // we need jwt check for all routes

  require('./users')(apiRouter)
  require('./cv')(apiRouter)

  app.use(serverCfg.api.mountPoint, apiRouter)
}
