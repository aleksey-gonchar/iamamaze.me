/* global helpers */
'use strict'
const serverCfg = $requireConfig('server')
const pkg = $require('package.json')

let server = null
let stopCallTimeoutId = null

function startServer (next) {
  if (!next) { next = () => {} }

  return new Promise ((resolve, reject) => {
    if (server) {
      // sever should be started once per folder
      if (stopCallTimeoutId) { clearTimeout(stopCallTimeoutId) }
      return resolve(next())
    }

    if (server) { return next() }

    $require(pkg.main)((err, srv) => {
      if (err) { console.error(err) }
      server = srv
      process.nextTick(() => resolve(next()))
      //resolve(next())
    })
  })
}

function stopServer (next) {
  if (!next) { next = () => {} }

  return new Promise((resolve, reject) => {
    if (server) {
      if (stopCallTimeoutId) { clearTimeout(stopCallTimeoutId) }
      stopCallTimeoutId = setTimeout(stopActually, 1000)
    }

    process.nextTick(() => resolve(next()))
  })
}

function stopActually () {
  if (server) {
    server.close()
    process.exit(0)
  }
}

helpers.server = {
  start: startServer,
  stop: stopServer
}