'use strict'
const bugsnag = require('bugsnag')
bugsnag.register('7b7f01539793def608c83d7cc8de87e3')

// require('babel-register')
require('./lib/require')
require('./lib/promise')
const serverCfg = $requireConfig('server')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.FETCH_STATE = process.env.FETCH_STATE || false

global.__FETCH_STATE__ = process.env.FETCH_STATE === 'false' ? false : true
global.__CLIENT__ = false
global.__SERVER__ = true
global.__DEVELOPMENT__ = process.env.NODE_ENV === 'development'
global.__API_BASE_URL__ = 'http://' + serverCfg.host + ':' + serverCfg.port + serverCfg.api.mountPoint
global.INITIAL_STATE = {}

const initMongo = require('./lib/initializers/mongo')
const initExpress = require('./lib/initializers/express')
const http = require('http')
const log = require('./lib/logger').get('APP')
const _ = require('lodash')

if (_.includes(['development', 'test'], process.env.NODE_ENV)) {
  require('longjohn')
}

log.info('Starting app in [' + process.env.NODE_ENV + '] env')

const port = serverCfg.port || 3000
let server
let onServerListenHook = null

Promise.all([
  initMongo(),
  initExpress()
])
  .then((res) => {
    let app = res[1]
    server = http.createServer(app)
    server.listen(port)
    server.on('error', onError)
    server.on('listening', onListening)
    server.on('close', onClosing)
  })
  .done()

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      log.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      log.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  log.info('Listening on ' + bind)
  if (_.isFunction(onServerListenHook)) {
    onServerListenHook(null, server)
  }
}

function onClosing () {
  log.info('Server stopped')
}

module.exports = (hook) => {
  if (_.isFunction(hook)) {
    onServerListenHook = hook
  }
}
