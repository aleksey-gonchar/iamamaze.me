'use strict'
const uuid = require('node-uuid')
const log = require('../logger').get()
const _ = require('lodash')

const reqProfiler = $require('lib/request-profiler')

module.exports = (options) => {
  const headerName = 'x-request-id'

  return (req, res, next) => {
    let id = req.headers[headerName] || uuid.v4()

    req.log = log.child({
      type: 'request',
      id: id
    })

    res.setHeader(headerName, id)
    req.log.info({req: req}, 'start request')

    reqProfiler.startTimer(res) // stopTimer for called fro send-response

    res.on('finish', () => {
      if (_.includes(['test', 'development', 'stage'], process.env.NODE_ENV)) {
        const bodyStr = JSON.stringify(res.body)
        const resBodySize = bodyStr.length
        if (resBodySize > 400) {
          res.body = bodyStr.substring(0, 400) +
            `\n<content trimmed to [${400}] from [${resBodySize}]>\n`
        }
      }

      req.log.info({res: res, duration: reqProfiler.getTimer(res, 'total')}, 'end request')
    })

    next()
  }
}
