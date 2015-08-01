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
  it('users basic crud', helpers.testCRUD({
    url: testUrl,
    mocks: {
      'create-valid': function() {
        return {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: faker.internet.password()
        }
      },
      'create-invalid': function(){
        return {
          'email': 'invalid'
        }
      },
      'update-valid': function(){
        return {
          'email': faker.internet.email()
        }
      },
      'update-invalid': function(){
        return {
          'email': 'invalid'
        }
      },
      'list-paginated': function() {
        var largerCursor = moment(created.created).add(1, 'second').toObjectId()
        return {
          limit: 1,
          cursor: largerCursor
        }
      }
    },
    expects: {
      'create-valid': function(body, next){
        created = body
        next()
      },
      'list': function(body, next){
        expect(body.length).to.equal(1)
        next()
      },
      'list-paginated': function(body, next){
        expect(typeof body).to.be.an('object')
        expect(body.limit).to.equal(1)
        expect(body.cursor).to.be.defined
        expect(body.items).to.be.defined
        expect(body.items.length).to.equal(1)
        expect(body.total).to.equal(1)
        next()
      },
      'update-invalid': function(body, next){
        expect(body.errors.email[0]).to.equal('email invalid')
        next()
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