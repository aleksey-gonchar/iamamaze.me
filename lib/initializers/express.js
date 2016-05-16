'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const path = require('path')
const methodOverride = require('method-override')
const compress = require('compression')

const layouts = require('handlebars-layouts')
const hbs = require('hbs')
const hbsUtils = require('hbs-utils')(hbs)
hbs.handlebars.registerHelper(layouts(hbs.handlebars))

hbsUtils.registerPartials(process.cwd() + '/views/partials')

const config = require('konphyg')(process.cwd() + '/config')
const serverCfg = config('server')
const secretsCfg = config('secrets')

// const expressReduxHandler = require('../responders/redux-handler')
const expressErrHandlers = $require('lib/responders/err-handlers')
const expressSendResponse = $require('lib/responders/send-response')
const tooBusyHandler = $require('lib/middleware/too-busy-handler')
const noCache = $require('lib/middleware/no-cache')


const port = serverCfg.port || 3000
const uploadsDir = serverCfg.uploadsDir

const requestLogger = $require('lib/middleware/request-logger')()

module.exports = () => {
  return new Promise (resolve => {
    let app = express()

    app.set('port', port)
    app.set('uploadsDir', uploadsDir)
    app.set('x-powered-by', false)
    app.set('query parser', 'extended')
    app.use(compress())

    app.set('views', path.join(process.cwd(), 'views'))
    app.set('view engine', 'hbs')

    app.use(favicon(path.join(process.cwd(), 'public/icons/favicon.ico')))

    //app.set('uploadsDir', path.resolve(path.join(process.cwd(), uploadsDir)))

    app.use(methodOverride())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cookieParser(secretsCfg.cookie))

    app.use(tooBusyHandler)
    app.use(noCache)

    app.use('/public', express.static(path.join(process.cwd(), 'public')))
    app.use('/public', express.static(path.join(process.cwd(), 'build')))
    app.use('/public/fonts', express.static(path.join(process.cwd(), 'node_modules/bootstrap-styl/fonts')))

    app.use(requestLogger)
    $require('routes')(app)

    // expressReduxHandler(app)
    expressErrHandlers.use(app)
    app.use(expressSendResponse.router)


    resolve(app)
  })
}