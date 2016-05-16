'use strict'
require('../../lib/require')
$require('lib/promise')

process.env.NODE_ENV = 'test'

const path = require('path')
const rmdir = require('rimraf')
const faker = require('faker')
const mongoose = require('mongoose')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const mongoCfg = $requireConfig('mongo')
const serverCfg = $requireConfig('server')

global.expect = chai.expect
global.sinon = require('sinon')
global.faker = faker

let helpers = global.helpers = {}
let variables = helpers.variables = {
  dbUri: mongoCfg.uri,
  httpEndpoint: 'http://127.0.0.1:' + serverCfg.port,
  apiEndpoint: 'http://127.0.0.1:' + serverCfg.port + serverCfg.api.mountPoint,
  uploadsDir: path.join(process.cwd(), '/test/uploads')
}

// require('./mock-resources')(helpers)
require('./testCRUD')
require('./user')
require('./server')

helpers.cleanUploads = (next) => {
  rmdir(variables.uploadsDir, next)
}
