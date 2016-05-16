'use strict'

const util = require('util')
const WritableStreamClass = require('stream').Writable
const loggerCfg = $requireConfig('logger')

let redisLoggerPubStreamClass = function (client) {
  WritableStreamClass.call(this)
  this.channel = `${loggerCfg.channel}-${process.env.NODE_ENV}`
  this.client = client
}

util.inherits(redisLoggerPubStreamClass, WritableStreamClass)

redisLoggerPubStreamClass.prototype._write = function (chunk, encoding, next) {
  this.client.publish(this.channel, chunk.toString())
  next()
}

module.exports = redisLoggerPubStreamClass
