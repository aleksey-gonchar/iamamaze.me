var $require = require(process.cwd() + '/lib/require')
var path = require('path')
var rmdir = require('rimraf')
var request = require('superagent')
var _ = require('lodash')
var faker = require('faker')
var mongoose = require('mongoose')

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

process.env.NODE_ENV = process.env.NODE_ENV || 'test'

var mongoCfg = require('konphyg')(process.cwd() + '/config')('mongo')
var serverCfg = require('konphyg')(process.cwd() + '/config')('server')
var pkg = $require('package.json')

global.expect = chai.expect
global.sinon = require('sinon')
global.faker = faker

var test = global.test = {}
var variables = test.variables = {
  dbUri: mongoCfg.uri,
  httpEndpoint: 'http://127.0.0.1:' + serverCfg.port,
  apiEndpoint: 'http://127.0.0.1:' + serverCfg.port + serverCfg.api.mountPoint,
  uploadsDir: path.join(process.cwd(), '/test/uploads')
}

//require('./testCRUD')(test)
//require('./mock-resources')(test)
require('./user')(test)

test.cleanUploads = function (next) {
  rmdir(variables.uploadsDir, next)
}

test.cleanDB = function (next) {
  mongoose.connect(variables.dbUri, function (err) {
    if (err) return next(err)
    mongoose.connection.db.dropDatabase(function () {
      mongoose.disconnect(next)
    })
  })
}

test.server = null

function start(next) {
  test.cleanDB(function (err) {
    if (err) return next(err)
    if (!test.server) {
      $require(pkg.main)(function whenStarted(err, server) {
        test.server = server
        next()
      })
    } else { next() }
  })
}

function stop (next) {
  if (test.server) {
    test.server.close()
    next()
  }
}

//test.start = _.once(start)
//test.stop = _.debounce(stop, 2000)
test.start = start
test.stop = stop

test.stopAndCleanupUploads = function (next) {
  test.stop(function (err) {
    if (err) return next(err)
    test.cleanUploads(next)
  })
}
