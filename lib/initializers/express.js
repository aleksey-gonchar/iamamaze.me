var express = require('express')
var bodyParser = require('body-parser')
var serverCfg = require('konphyg')(process.cwd() + '/config')('server')

var router = require(process.cwd() + '/routes')

var app = express()
var port = serverCfg.port || 3000


function onError(err) {
  console.log(err)
}

function bootstrap() {
  app.set('query parser', 'extended')

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))

  app.use(router)

  // GENERAL error handling
  app.use(function (err, req, res, next) {
    if (err.status) {
      return res.status(err.status).json(err.json)
    }
    next(err, req, res, next)
  })

  var server = app.listen(port, function () {
    console.info('Listening on ' + port)
  })
}

module.exports = bootstrap