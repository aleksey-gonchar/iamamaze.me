/* global helpers */
var $require = require(process.cwd() + '/lib/require')
var faker = require('faker')
var _ = require('lodash')
var request = require('request')
var Promise = require('bluebird')

var User = $require('models/user')

function getToken (user) {
  var jwt = require('jsonwebtoken')
  var userProfile = {
    id: user.id.toString(),
    created: user.created,
    email: user.email
  }
  return jwt.sign(userProfile, 'iamamaze.meapiv0')
}

/**
 * Creates user directly into db
 * userData is object hash of User model properties, where the following will be automatically
 * populated:
 *
 * + firstName
 * + lastName
 * + email
 * + password
 *
 */
function createUser (userData) {
  var deferred = Promise.defer()

  var fullUserData = _.chain(userData).clone().defaults({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }).value

  User.create(fullUserData, function (err, user) {
    if (err) {
      deferred.reject(err)
    }
    deferred.resolve(user)
  })

  return deferred.promise
}

function loginUser (userData) {
  var deferred = Promise.defer()
  request.post({
    uri: helpers.variables.apiEndpoint + '/users/login',
    json: {
      'email': userData.email,
      'password': userData.password
    }
  }, function (err, res, body) {
    if (err) {
      return deferred.reject(err)
    }
    if (res.statusCode !== 200) {
      return deferred.reject(body)
    }

    deferred.resolve(body)
  })

  return deferred.promise
}

function activateUser (userData) {
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

function createAndLoginUser (userData) {
  // clone the given userData and inject if not present email and password values to be used for create and login actions
  var clonedUserData = _.clone(userData)
  clonedUserData.email = clonedUserData.email || faker.internet.email()
  clonedUserData.password = clonedUserData.password || faker.internet.password()

  return helpers.createUser(clonedUserData)
    .then(function () {
      return helpers.activateUser(clonedUserData)
        .then(function () {
          return helpers.loginUser(clonedUserData)
        })
    })
}

module.exports = function (helpers) {
  helpers.user = {
    getToken: getToken,
    create: createUser,
    login: loginUser,
    activate: activateUser,
    createAndLogin: createAndLoginUser
  }
}
