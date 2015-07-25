process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var initMongo = require('./lib/initializers/mongo')
var initExpress = require('./lib/initializers/express')
var http = require('http')
var Promise = require('bluebird')

if (process.env.NODE_ENV === 'development') {
  require('longjohn')
}

var serverCfg = require('konphyg')(process.cwd() + '/config')('server')
var port = serverCfg.port || 3000
var server

Promise.all([initMongo(), initExpress()])
  .then(function (res) {
    var app = res[1]
    server = http.createServer(app)
    server.listen(port)
    server.on('error', onError)
    server.on('listening', onListening)
  })
  .done()

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
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
  console.log('Listening on ' + bind)
}
