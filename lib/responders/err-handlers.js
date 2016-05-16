'use strict'
const loggerCfg = $requireConfig('logger')
const log = require('../logger').get('[err]')
const _ = require('lodash')

function flattenValidationError (err) {
  var errors = {}
  for (var key in err.errors) {
    if (err.errors[key].type === 'required') {
      errors[err.errors[key].path] = [err.errors[key].path + ' is required']
    } else {
      if (err.errors[key].name === 'ValidationError') {
        var nested_errors = flattenValidationError(err.errors[key])
        for (var nested_key in nested_errors)
          errors[key + '.' + nested_key] = nested_errors[nested_key]
      } else {
        errors[err.errors[key].path] = [err.errors[key].message]
      }
    }
  }
  return errors
}

function default404Handler (req, res, next) {
  res.statusCode = res.statusCode || 404

  if (res.statusCode === 404) {
    const errMsg = `[${res.statusCode}] Not found: ${req.method} ${req.originalUrl}`
    res.body = res.body || { error: errMsg }

    let err = new Error(errMsg)
    err.code = res.statusCode
    log.warn({ err })
  }
  next()
}

function assertionErrHandler (err, req, res, next) {
  let isAssertionErr = err.constructor.name === 'AssertionError'
  if (!isAssertionErr) { return next(err) }

  if (process.env.NODE_ENV === 'production') { err = _.omit(err, 'stack') }

  err.code = err.code || 500
  res.statusCode = err.code
  res.body = err

  if (err.code === 500) {
    log.error({error: err})
  } else {
    log.warn({ err })
  }

  next()
}

function defaultHandler (err, req, res, next) {
  err.code = err.code || 500
  if (err.code === 500) {
    log.error({err: err})
    log.error(err.stack)
  } else {
    log.warn({ err })
  }

  res.statusCode = err.code
  res.body = err.message
  next()
}

function tooBusyErrHandler (err, req, res, next) {
  if (err.code === 503) {
    log.error({err: err})
    res.statusCode = err.code
    res.body = err.message
    next()
  } else {
    next(err)
  }
}

function useApp (app) {
  app.use(tooBusyErrHandler)
  app.use(assertionErrHandler)
  app.use(defaultHandler)
  app.use(default404Handler)
}

module.exports = { use: useApp }