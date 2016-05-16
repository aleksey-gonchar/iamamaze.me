'use strict'
const _ = require('lodash')
const express = require('express')

let router = new express.Router()
const reqProfiler = $require('lib/request-profiler')

function sendResponse (req, res, next) {
  reqProfiler.stopTimer(res)
  if (_.isObject(res.body)) {
    res.body._requestProfileLog = reqProfiler.getTimer(res)
  }

  if (res.template) {
    return res.render(res.template, res.opts)
  }

  if (res.response || res.body) {
    if (req.accepts('json') === 'json') {
      return res.json(res.response || res.body)
    } else {
      return res.send(res.response || res.body)
    }
  }

  next()
}

router.use((req, res, next) => {
  sendResponse(req, res, next)
})

module.exports = { router: router }
