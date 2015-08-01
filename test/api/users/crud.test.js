/* global before, after, it, expect, faker, sinon, afterEach, beforeEach, describe, helpers */

var moment = require('moment')
var request = require('superagent')

describe('users CRUD', function () {
  var currUser
  var userData = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  }

  var testUrl = helpers.variables.apiEndpoint + '/users'

  before(helpers.start)
  after(helpers.stop)

  var created = null
  describe('users basic CRUD', helpers.testCRUD(testUrl, {
    'create-valid': {
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      },
      expects: function(err, res){
        created = res.body
      }
    },
    'create-invalid': {
      data: {
        'email': 'invalid'
      }
    },
    'patch-valid': {
      data: {
        'email': faker.internet.email()
      }
    },
    'patch-invalid': {
      data: {
        'email': 'invalid'
      },
      expects : function(err, res){
        var body = res.body
        expect(body.errors.email[0]).to.equal('email invalid')
      }
    }
  }))

  it('create new user', function (next) {
    request.post(testUrl)
      .send(userData)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res.statusCode).to.be.equal(200)
        var body = res.body
        expect(body.email).to.be.equal(userData.email.toLowerCase())
        expect(body.password).to.be.undefined
        expect(body.token).to.be.undefined
        next()
      })
  })
})