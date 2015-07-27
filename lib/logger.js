var bunyan = require('bunyan')
var bunyanFormat = require('bunyan-format')
var formatOut = bunyanFormat({outputMode: 'short'})
var pkg = require(process.cwd() + '/package.json')

var logger = bunyan.createLogger({
  name: pkg.name,
  stream: formatOut,
  level: 'debug'
})

module.exports = logger
