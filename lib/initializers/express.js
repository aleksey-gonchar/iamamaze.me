var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var favicon = require('serve-favicon')
var path = require('path')
var methodOverride = require('method-override')
var multer = require('multer')

var config = require('konphyg')(process.cwd() + '/config')
var serverCfg = config('server')
var secretsCfg = config('secrets')

var expressErrHandlers = require(process.cwd() + '/lib/responders/express-err-handlers')
var expressSendResponse = require(process.cwd() + '/lib/responders/express-send-response')

var router = require(process.cwd() + '/routes')
var app = express()

var port = serverCfg.port || 3000
var uploadsDir = serverCfg.uploadsDir

module.exports = function bootstrap () {
  app.set('port', port)
  app.set('uploadsDir', uploadsDir)
  app.set('x-powered-by', false)
  app.set('query parser', 'extended')

  app.set('views', path.join(process.cwd(), 'views'))
  app.set('view engine', 'handlebar')

  app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')))
  app.use(logger('dev'))

  app.set('uploadsDir', path.resolve(path.join(process.cwd(), uploadsDir)))
  app.use(multer({ dest: uploadsDir }))

  app.use(methodOverride)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser(secretsCfg.cookie))
  app.use(express.static(path.join(process.cwd(), 'public')))

  app.use(router)
  expressSendResponse(app)
  expressErrHandlers(app)

  return Promise.resolve(app)
}
