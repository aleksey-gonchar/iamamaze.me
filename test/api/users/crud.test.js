/* global before, after, faker, describe, helpers, expect */
describe('users CRUD', function () {
  var testUrl = helpers.variables.apiEndpoint + '/users'

  before(helpers.start)
  after(helpers.stop)

  describe('users basic CRUD', helpers.testCRUD(testUrl, {
    'create-valid': {
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
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
      expects: (err, res) => {
        expect(err).to.be.not.defined
        var body = res.body
        expect(body.errors.email[0]).to.equal('email invalid')
      }
    }
  }))
})
