/* global before, after, it, expect, faker, sinon, afterEach, beforeEach, describe, helpers */
var _ = require('lodash')
var qs = require('querystring')
var moment = require('moment')
require('moment-objectid')()

module.exports = function (helpers) {
  helpers.testCRUD = function (options) {
    return function (next) {
      var request = require('request')
      var created = null

      it('create valid', function (next) {
        var url = _.result(options, 'url')
        request.post({
          url: url,
          json: options.mocks['create-valid']()
        }, function (err, res, body) {
          expect(err).to.be.not.defined
          expect(res.statusCode).to.equal(200, body)
          created = body
          if (options.expects['create-valid']) {
            options.expects['create-valid'](body, next)
          } else {
            next()
          }
        })
      })

      it('create invalid', function (next) {
        var url = _.result(options, 'url')
        request.post({
          url: url,
          json: options.mocks['create-invalid']()
        }, function (err, res, body) {
          expect(err).to.be.not.defined
          expect(res.statusCode).to.equal(422, body)
          expect(body.errors).to.be.not.undefined
          if (options.expects['create-invalid']) {
            options.expects['create-invalid'](body, next)
          } else {
            next()
          }
        })
      })

      it('list', function (next) {
        var url = _.result(options, 'url')
        request.get({
          url: url,
          json: {}
        }, function (err, res, body) {
          expect(err).to.be.not.defined
          expect(res.statusCode).to.equal(200, body)
          if (options.expects['list']) {
            options.expects['list'](body, next)
          } else {
            next()
          }
        })
      })

      it('list paginated', function (next) {
        var url = _.result(options, 'url') + '?' + qs.stringify(
            options.mocks['list-paginated'] ? options.mocks['list-paginated']() : {}
          )
        request.get({
          url: url,
          json: {}
        }, function (err, res, body) {
          expect(err).to.be.not.defined
          expect(res.statusCode).to.equal(200, body)
          if (options.expects['list-paginated']) {
            options.expects['list-paginated'](body, next)
          } else {
            next()
          }
        })
      })

      it('list paginated no cursor', function (next) {
        var url = _.result(options, 'url') + '?' + qs.stringify({ limit: 1 })
        request.get({
          url: url,
          json: {}
        }, function (err, res, body) {
          expect(err).to.be.not.defined
          expect(res.statusCode).to.equal(200, body)
          expect(body.total).to.equal(1)
          expect(body.limit).to.equal(1)
          if (options.expects['list-paginated-no-cursor']) {
            options.expects['list-paginated-no-cursor'](body, next)
          } else {
            next()
          }
        })
      })

      it('list paginated empty', function (next) {
        var smallerCursor = moment(created.created).subtract(10, 'second').toObjectId()
        var url = _.result(options, 'url') + '?' + qs.stringify({ cursor: smallerCursor, limit: 1 })
        request.get({
          url: url,
          json: {}
        }, function (err, res, body) {
          expect(err).to.be.not.defined
          expect(res.statusCode).to.equal(200, body)
          expect(body.total).to.equal(0)
          expect(body.limit).to.equal(1)
          if (options.expects['list-paginated-empty']) {
            options.expects['list-paginated-empty'](body, next)
          } else {
            next()
          }
        })
      })

      it('list paginated invalid', function (next) {
        var smallerCursor = moment(created.created).subtract(10, 'second').toObjectId()
        var url = _.result(options, 'url') + '?' + qs.stringify({ cursor: smallerCursor })
        request.get({
          url: url,
          json: {}
        }, function (err, res, body) {
          expect(err).to.be.not.defined
          expect(res.statusCode).to.equal(200, body)
          expect(_.isArray(body)).to.equal(true)
          if (options.expects['list-paginated-invalid']) {
            options.expects['list-paginated-invalid'](body, next)
          } else {
            next()
          }
        })
      })

      it('retrieve', function (next) {
        var url = _.result(options, 'url')
        request.get({
          url: url + '/' + created.id,
          json: {}
        }, function (err, res, body) {
          expect(err).to.be.not.defined
          expect(res.statusCode).to.equal(200, body)
          expect(body.id).to.equal(created.id)
          if (options.expects['retrieve']) {
            options.expects['retrieve'](body, next)
          } else {
            next()
          }
        })
      })

      it('update valid', function (next) {
        var url = _.result(options, 'url')
        request.put({
          url: url + '/' + created.id,
          json: options.mocks['update-valid']()
        }, function (err, res, body) {
          expect(err).to.be.not.defined
          expect(res.statusCode).to.equal(200, body)
          if (options.expects['update-valid']) {
            options.expects['update-valid'](body, next)
          } else {
            next()
          }
        })
      })

      it('update invalid', function (next) {
        var url = _.result(options, 'url')
        request.put({
          url: url + '/' + created.id,
          json: options.mocks['update-invalid']()
        }, function (err, res, body) {
          expect(err).to.be.not.defined
          expect(res.statusCode).to.equal(422, body)
          expect(body.errors).to.be.not.undefined
          if (options.expects['update-invalid']) {
            options.expects['update-invalid'](body, next)
          } else {
            next()
          }
        })
      })

      it('delete', function (next) {
        var url = _.result(options, 'url')
        request.del({
          url: url + '/' + created.id,
          json: {}
        }, function (err, res, body) {
          expect(err).to.be.not.defined
          expect(res.statusCode).to.equal(200, body)
          if (options.expects['delete-valid']) {
            options.expects['delete-valid'](body, next)
          } else {
            next()
          }
        })
      })

      next()
    }
  }
}
