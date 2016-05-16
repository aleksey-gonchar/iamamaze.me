'use strict'
const _ = require('lodash')
const toobusy = require('toobusy-js')

toobusy.maxLag(300)
toobusy.interval(500)

function tooBusyHandler (req, res, next) {
  if (toobusy()) {
    let err = new Error('I\'m busy right now, sorry.')
    err.code = 503
    delete err.stack
    return next(err)
  }

  next()
}

module.exports = tooBusyHandler