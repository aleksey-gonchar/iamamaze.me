var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var favicon = require('serve-favicon')
var path = require('path')

var serverCfg = require('konphyg')(process.cwd() + '/config')('server')

var router = require(process.cwd() + '/routes')
var app = express()

var port = serverCfg.port || 3000

function bootstrap() {
  app.set('port', port)
  app.set('query parser', 'extended')

  app.set('views', path.join(process.cwd(), 'views'))
  app.set('view engine', 'handlebar')

  app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')))
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(express.static(path.join(process.cwd(), 'public')))

  app.use(router)

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // error handlers
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {}
    })
  })

  return Promise.resolve(app)
}

module.exports = bootstrap