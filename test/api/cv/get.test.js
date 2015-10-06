/* global before, after, faker, describe, helpers, expect */
//require('isomorphic-fetch')
var request = require('superagent')
var _ = require('lodash')

describe.only('CV', () => {
  var testUrl = helpers.variables.apiEndpoint + '/cv'
  var CV = null

  before(helpers.start)
  after(helpers.stop)

  it('GET\'s total object' , (next) => {
    request.get(testUrl)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res.statusCode).to.be.equal(200)
        var body = res.body

        expect(body).to.be.an('object')
        CV = body
        next()
      })
  })

  it('GET\'s summary' , (next) => {
    request.get(testUrl + '/summary')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res.statusCode).to.be.equal(200)
        var body = res.body

        expect(body).to.eq(CV.summary)
        next()
      })
  })

  it('GET\'s contacts' , (next) => {
    request.get(testUrl + '/contacts')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res.statusCode).to.be.equal(200)
        var body = res.body

        expect(body).to.deep.equal(CV.contacts)
        next()
      })
  })

  it('GET\'s languages' , (next) => {
    request.get(testUrl + '/languages')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res.statusCode).to.be.equal(200)
        var body = res.body

        expect(body).to.deep.equal(CV.languages)
        next()
      })
  })

  it('GET\'s hobbies' , (next) => {
    request.get(testUrl + '/hobbies')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res.statusCode).to.be.equal(200)
        var body = res.body

        expect(body).to.deep.equal(CV.hobbies)
        next()
      })
  })

  it('GET\'s education' , (next) => {
    request.get(testUrl + '/education')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res.statusCode).to.be.equal(200)
        var body = res.body

        expect(body).to.deep.equal(CV.education)
        next()
      })
  })

  it('GET\'s skills' , (next) => {
    request.get(testUrl + '/skills')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res.statusCode).to.be.equal(200)
        var body = res.body

        expect(body).to.deep.equal(CV.skills)
        next()
      })
  })

  it('GET\'s projects' , (next) => {
    request.get(testUrl + '/projects')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res.statusCode).to.be.equal(200)
        var body = res.body

        expect(body).to.deep.equal(CV.projects)
        next()
      })
  })

  it('GET\'s skill-last-updated' , (next) => {
    request.get(testUrl + '/skills-last-updated')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res.statusCode).to.be.equal(200)
        var body = res.body
        expect(body).to.equal(CV.skillsLastUpdated)
        next()
      })
  })
})
