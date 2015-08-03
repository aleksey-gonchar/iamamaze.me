/* global before, after, faker, describe, xdescribe, helpers, expect */
var _ = require('lodash')

describe('users CRUD', function () {
  var currUser
  var currHeader
  var testUrl = helpers.variables.apiEndpoint + '/users'

  before(helpers.start)
  after(helpers.stop)

  describe('checking', helpers.testCRUD(testUrl, {
    'create-valid': {
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      },
      after: (res, next) => {
        currUser = res.body
        currUser.password = this.data.password
        return _.isFunction(next) && next()
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
      },
      before: (next) => {
        return helpers.user.login(currUser).then((res) => {
          currHeader = { Authorization: res.token }

          next({ header: currHeader })
        })
      }
    },
    'patch-invalid': {
      header: () => { return currHeader },
      data: {
        'email': 'invalid'
      },
      expects: (err, res) => {
        expect(err).to.be.not.defined
        var body = res.body
        expect(body.errors.email[0]).to.equal('email invalid')
      }
    }
  }))
})
