var bunyan = require('bunyan')
var pkg = require(process.cwd() + '/package.json')
var _ = require('lodash')

var opts = {
  name: pkg.name,
  level: 'debug'
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
