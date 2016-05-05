'use strict'
const _ = require('lodash')
global.Promise = require('bluebird')

let opts
if (_.includes(['development', 'test'], process.env.NODE_ENV)) {
  opts = {
    //warnings: true,
    longStackTraces: true,
    cancellation: true,
    monitoring: true
  }
} else {
  opts = {
    cancellation: true
  }
}

Promise.config(opts)