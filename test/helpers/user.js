var $require = require(process.cwd() + '/lib/require')
var mongoose = require('mongoose')
var faker = require('faker')
var request = require('superagent')
var _ = require('lodash')
var Promise = require('bluebird')

var User = $require('models/user')

var getToken = user => {
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
var createUser = userData => {
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

var loginUser = userData => {
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

var activateUser = userData => {
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

var createAndLoginUser = (userData) => {
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

module.exports = (test) => {
  test.getToken = getToken
  test.createUser = createUser
  test.loginUser = loginUser
  test.activateUser = activateUser
  test.createAndLoginUser = createAndLoginUser
}
