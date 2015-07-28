var $require = require('../require')
var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var favicon = require('serve-favicon')
var path = require('path')
var methodOverride = require('method-override')
var multer = require('multer')

var layouts = require('handlebars-layouts')
var hbs = require('hbs')
var hbsUtils = require('hbs-utils')(hbs)
hbs.handlebars.registerHelper(layouts(hbs.handlebars))

hbsUtils.registerPartials(process.cwd() + '/views/partials')

var config = require('konphyg')(process.cwd() + '/config')
var serverCfg = config('server')
var secretsCfg = config('secrets')

var expressErrHandlers = $require('lib/express-responders/err-handlers')
var expressSendResponse = $require('lib/express-responders/send-response')

var router = $require('routes')
var app = express()

var port = serverCfg.port || 3000
var uploadsDir = serverCfg.uploadsDir

var log = $require('lib/logger')
var bunyanRequest = require('bunyan-request');
var requestLogger = bunyanRequest({
  logger: log,
  headerName: 'x-request-id'
});

module.exports = function bootstrap () {
  app.set('port', port)
  app.set('uploadsDir', uploadsDir)
  app.set('x-powered-by', false)
  app.set('query parser', 'extended')

  app.set('views', path.join(process.cwd(), 'views'))
  app.set('view engine', 'hbs')

  app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')))

  app.set('uploadsDir', path.resolve(path.join(process.cwd(), uploadsDir)))
  app.use(multer({ dest: uploadsDir }))

  app.use(methodOverride())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser(secretsCfg.cookie))
  app.use('/public', express.static(path.join(process.cwd(), 'public')))
  app.use('/js', express.static(path.join(process.cwd(), 'build/js')))
  app.use('/styles', express.static(path.join(process.cwd(), 'build/styles')))

  app.use(function (req, res, next) {
    log.info({req: req})
    next()
  })

  app.use(router)
  expressSendResponse(app)
  expressErrHandlers(app)

  return Promise.resolve(app)
}
