'use strict'
const bunyan = require('bunyan')
const bunyanFormat = require('bunyan-format')
const pkg = require(process.cwd() + '/package.json')
const _ = require('lodash')
const redisLoggerPubStreamClass = require('./redis-logger-pub-stream')

function reqSerializer (req) {
  const headers = _.pick(req.headers, ['host', 'user-agent', 'x-real-ip'])

  let res = {
    method: req.method,
    url: req.url,
    headers: headers
  }

  if (!_.isEmpty(req.query)) { res.query = req.query }
  if (!_.isEmpty(req.params)) { res.params = req.params }
  if (!_.isEmpty(req.body)) { res.body = req.body }

  return res
}

function resSerializer (res) {
  const headers = _.pick(res._headers, ['content-length', 'content-type'])

  return {
    statusCode: res.statusCode,
    headers: headers,
    body: res.body
  }
}

function errSerializer (err) {
  if (!_.isObject(err)) return err

  let resErr = err.name || 'Error'
  resErr = resErr + ': '
  if (_.has(err, 'message') && err.message) {
    resErr = resErr + err.message
  }
  if (_.has(err, 'body.errors.base') && _.isArray(err.body.errors.base)) {
    resErr = resErr + err.body.errors.base.join(', ')
  }

  resErr = {
    code: err.code,
    message: resErr
  }

  if (_.has(err, 'stack') && err.code > 404) {
    resErr.stack = err.stack
  }

  return resErr
}

const defaultOpts = {
  name: pkg.name,
  level: 'error',
  serializers: {
    req: reqSerializer,
    res: resSerializer
  }
}

function applyFormat (opts) {
  if (_.includes(['development', 'test', 'stage', 'production'], process.env.NODE_ENV)) {
    const formatOut = bunyanFormat({outputMode: 'short'})
    const logLevel = opts.ignoreLogLevel ? 'info' : process.env.LOG_LEVEL
    let streams = []

    streams.push({ stream : formatOut })

    if (opts.useRedisTransport) {
      streams.push({
        type: 'stream',
        stream: new redisLoggerPubStreamClass(opts.client)
      })
    }

    opts = _.extend(opts, {
      streams,
      level: logLevel,
      serializers: _.extend(defaultOpts.serializers, {
        err: errSerializer
      })
    })

    return opts
  }
}

function createLogger (name, opts) {
  opts = _.defaults(opts, defaultOpts)
  opts.name = name
  applyFormat(opts)
  return bunyan.createLogger(_.omit(opts, ['ignoreLogLevel', 'useRedisTransport', 'client']))
}

let loggers = {}

/**
 *
 * @param name
 * @param opts{obj} - { ignoreEnv }
 * @returns {*}
 */
function getLogger (name, opts) {
  opts = _.defaults(opts, {
    ignoreLogLevel: false,
    useRedisTransport: false
  })

  if (!name) {name = pkg.name}
  if (loggers[name]) return loggers[name]

  const newLogger = createLogger(name, opts)
  loggers[name] = newLogger
  return newLogger
}

module.exports = { 'get': getLogger }
