/* global before, after, it, expect, faker, describe, helpers */
var request = require('superagent')

describe('login', function () {
   var currUser
  var userData = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  }

  var testUrl = helpers.variables.apiEndpoint + '/users/login'

  before(helpers.start)
  before((next) => {
    helpers.user.createAndLogin(userData).then((user) => {
      currUser = user
      next()
    })
  })
  after(helpers.stop)

  it('login user', function (next) {
    request.post(testUrl)
      .send(userData)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res.statusCode).to.be.equal(200)
        var body = res.body
        expect(body.email).to.be.equal(userData.email.toLowerCase())
        expect(body.password).to.be.undefined
        expect(body.token).to.be.ok
        next()
      })
  })
})
