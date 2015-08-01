/* global before, after, it, expect, faker, sinon, afterEach, beforeEach, describe, helpers */

var request = require('superagent')

describe.skip('users CRUD1', function () {
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

  it('create another new user', function (next) {
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