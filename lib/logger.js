var bunyan = require('bunyan')
var pkg = require(process.cwd() + '/package.json')
var _ = require('lodash')

function reqSerializer(req) {
  return {
    method: req.method,
    url: req.url
  }
}

function errSerializer(err) {
  if (!_.isObject(err)) return err

  var obj = { name: err.name }

  if (_.has(err, 'message') && !_.isEmpty(obj.message)) { obj.message = err.message }
  if (_.has(err, 'body.errors.base')) { obj.messages = err.body.errors.base}

  return obj
}

var opts = {
  name: pkg.name,
  level: 'debug',
  serializers: {
    req: reqSerializer,
    err: errSerializer
  }
}

if (process.env.NODE_ENV === 'development') {
  var bunyanFormat = require('bunyan-format')
  var formatOut = bunyanFormat({outputMode: 'short'})

  opts = _.extend(opts, {
    stream: formatOut
  })
}

var logger = bunyan.createLogger(opts)

module.exports = logger
