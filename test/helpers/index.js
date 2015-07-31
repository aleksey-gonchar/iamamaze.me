var path = require('path')
var rmdir = require('rimraf')
var Promise = require('bluebird')
var request = require('superagent')
var $require = require(process.cwd() + '/lib/require')
var mongoose = require('mongoose')
var faker = require('faker')
var _ = require('lodash')

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

process.env.NODE_ENV = process.env.NODE_ENV || 'test'

var User = $require('models/user')

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
    setTimeout( function () {
      console.log('stop')
      next()
    }, 1000)
  }
}

//test.start = _.debounce(start, 2000)
//test.stop = _.debounce(stop, 2000)
test.start = start
test.stop = stop

test.stopAndCleanupUploads = function (next) {
  test.stop(function (err) {
    if (err) return next(err)
    test.cleanUploads(next)
  })
}

test.getToken = function (user) {
  var jwt = require('jsonwebtoken')
  var userProfile = {
    id: user.id.toString(),
    created: user.created,
    email: user.email
  }
  return jwt.sign(userProfile, 'iamamaze.meapiv0')
}

/**
 * creates user directly into db
 * userData is object hash of User model properties, where the following will be automatically populated:
 *
 * + firstName
 * + lastName
 * + email
 * + password
 *
 */
test.createUser = function (userData) {
  var deferred = Promise.defer()

  // clone userData so that it stays untouched
  var clonedUserData = R.clone(userData)

  // populate fields automatically if not present
  clonedUserData.firstName = clonedUserData.firstName || faker.name.firstName()
  clonedUserData.lastName = clonedUserData.lastName || faker.name.lastName()
  clonedUserData.email = clonedUserData.email || faker.internet.email()
  clonedUserData.password = clonedUserData.password || faker.internet.password()
  clonedUserData.beenConvicted = clonedUserData.beenConvicted || false

  User.create(clonedUserData, function (err, user) {
    if (err) {
      deferred.reject(err)
    }
    deferred.resolve(user)
  })

  return deferred.promise
}

test.loginUser = function (userData) {
  var deferred = Promise.defer()
  request.post({
    uri: test.variables.apiEndpoint + '/users/login',
    json: {
      'email': userData.email,
      'password': userData.password
    }
  }, function (err, res, body) {
    if (err) {
      return deferred.reject(err)
    }
    if (res.statusCode !== 200) {
      return deferred.reject(new Error(res.statusCode + body))
    }

    deferred.resolve(body)
  })

  return deferred.promise
}

test.activateUser = function (userData) {
  var deferred = Promise.defer()
  User.findByCredentials(userData.email, userData.password, function (err, user) {
    if (err) {
      return deferred.reject(err)
    }
    if (!user) {
      return deferred.reject(new Error('user not found ' + userData.email + ' ' + userData.password))
    }
    user.active = true
    user.save(function (res) {
      deferred.resolve(res)
    })
  })

  return deferred.promise
}

test.createAndLoginUser = function (userData) {
  // clone the given userData and inject if not present email and password values to be used for create and login actions
  var clonedUserData = R.clone(userData)
  clonedUserData.email = clonedUserData.email || faker.internet.email()
  clonedUserData.password = clonedUserData.password || faker.internet.password()
  clonedUserData.beenConvicted = clonedUserData.beenConvicted || false

  return test.createUser(clonedUserData)
    .then(function () {
      return test.activateUser(clonedUserData)
        .then(function () {
          return test.loginUser(clonedUserData)
        })
    })
}
