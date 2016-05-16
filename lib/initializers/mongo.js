'use strict'
const mongoCfg = $requireConfig('mongo')
const mongoose = require('mongoose')

const log = require('../logger').get('[mongo]')
$requireTree('/models')

function connect () {
  return new Promise((resolve, reject) => {
    log.info('Connecting to MongoDB on %s', mongoCfg.uri)
    mongoose.connect(mongoCfg.uri)

    const db = mongoose.connection
    db.on('error', function connectionError (err) {
      // TODO error reporters check
      // errorReporter(err)
      reject(err)
    })
    db.once('open', function callback () {
      log.info('Connected to MongoDB on %s', mongoCfg.uri)
      resolve(db)
    })
  })
}

module.exports = connect
