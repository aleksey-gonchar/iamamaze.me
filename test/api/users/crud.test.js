/* global before, after, it, expect, faker, sinon, afterEach, beforeEach, describe, test */

var request = require('superagent')

describe('users CRUD', function () {
  var currUser
  var userData = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  }

  var testUrl = test.variables.apiEndpoint + '/users'

  before(test.start)
  after(test.stop)

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