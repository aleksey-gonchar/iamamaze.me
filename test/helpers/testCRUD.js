/* global before, after, it, expect, faker, sinon, afterEach, beforeEach, describe, helpers */
var $require = require(process.cwd() + '/lib/require')
var _ = require('lodash')
var _s = require('underscore.string')
var qs = require('querystring')
var moment = require('moment')
var buildCRUD = $require('lib/api-helpers/buildCRUD')
require('moment-objectid')()
var request = require('superagent')

var defaults = {
  'create-valid' : {
    data: {},
    expects: function (err, res) {
      var body = res.body
      expect(err).to.be.not.defined
      expect(res.statusCode).to.equal(200)
      expect(body.errors).to.be.not.defined
      currDoc = res.body
    }
  },
  'create-invalid' : {
    data: {},
    expects: function (err, res) {
      var body = res.body
      expect(err).to.be.not.defined
      expect(res.statusCode).to.equal(422)
      expect(body.errors).to.be.not.undefined
    }
  },
  'patch-valid': {
    data: {}
  },
  'patch-invalid': {
    data: {}
  },
  'list' : {
    data: {},
    expects : function(err, res){
      var body = res.body
      expect(body.length).to.be.at.least(1)
    }
  },
  'list-paginated': {
    data: function () {
      var largerCursor = moment(currDoc.created).add(1, 'second').toObjectId()
      return {
        limit: 1,
        cursor: largerCursor
      }
    },
    expects: function(err, res){
      var body = res.body
      expect(body).to.be.an('object')
      expect(body.limit).to.equal(1)
      expect(body.cursor).to.be.defined
      expect(body.items).to.be.defined
      expect(body.items.length).to.equal(1)
      expect(body.total).to.equal(1)
    }
  }
}

var actions = _.keys(defaults)

var currDoc = null

function extendDefaultsByOptions(options) {
  _.each(actions, function (action) {
    if (_.has(options, action)) {
      if (_.isFunction(options[action].expects)) {
        options[action].expects = [options[action].expects]
      }
      if (_.isFunction(defaults[action].expects)) {
        options[action].expects= [defaults[action].expects]
      }

      options[action].data = options[action].data
    } else {
      options[action] =  defaults[action]
    }
  })

  return options
}

function createTestCRUDFunction (baseUrl, options) {
  return function () {
    options = extendDefaultsByOptions(options)

    _.each(options, function (opt, action) {
      var route = buildCRUD.actionsMapping[action.split('-').shift()]
      var method = route.split(' ').shift().toLowerCase()
      var hasId = _s.include(route, 'mongoId')

      it(action, function(next) {
        var actionUrl = baseUrl

        if (hasId) {
          actionUrl = baseUrl + '/' + currDoc.id
        }

        if(action === 'list-paginated') {
          actionUrl = baseUrl + '?' + qs.stringify(_.result(opt, 'data'))
        }
        request[method](actionUrl)
          .send(opt.data)
          .end(function (err, res) {
            if (_.isArray(opt.expects)) {
              _.each(opt.expects, function (item) { item(err, res) })
            }
            if (_.isFunction(opt.expects)) { opt.expects(err, res) }
            next()
          })
      })
    })
  }

  //  it('list paginated no cursor', function (next) {
  //    var url = _.result(options, 'url') + '?' + qs.stringify({ limit: 1 })
  //    request.get({
  //      url: url,
  //      json: {}
  //    }, function (err, res, body) {
  //      expect(err).to.be.not.defined
  //      expect(res.statusCode).to.equal(200, body)
  //      expect(body.total).to.equal(1)
  //      expect(body.limit).to.equal(1)
  //      if (options.expects['list-paginated-no-cursor']) {
  //        options.expects['list-paginated-no-cursor'](body, next)
  //      } else {
  //        next()
  //      }
  //    })
  //  })
  //
  //  it('list paginated empty', function (next) {
  //    var smallerCursor = moment(created.created).subtract(10, 'second').toObjectId()
  //    var url = _.result(options, 'url') + '?' + qs.stringify({ cursor: smallerCursor, limit: 1 })
  //    request.get({
  //      url: url,
  //      json: {}
  //    }, function (err, res, body) {
  //      expect(err).to.be.not.defined
  //      expect(res.statusCode).to.equal(200, body)
  //      expect(body.total).to.equal(0)
  //      expect(body.limit).to.equal(1)
  //      if (options.expects['list-paginated-empty']) {
  //        options.expects['list-paginated-empty'](body, next)
  //      } else {
  //        next()
  //      }
  //    })
  //  })
  //
  //  it('list paginated invalid', function (next) {
  //    var smallerCursor = moment(created.created).subtract(10, 'second').toObjectId()
  //    var url = _.result(options, 'url') + '?' + qs.stringify({ cursor: smallerCursor })
  //    request.get({
  //      url: url,
  //      json: {}
  //    }, function (err, res, body) {
  //      expect(err).to.be.not.defined
  //      expect(res.statusCode).to.equal(200, body)
  //      expect(_.isArray(body)).to.equal(true)
  //      if (options.expects['list-paginated-invalid']) {
  //        options.expects['list-paginated-invalid'](body, next)
  //      } else {
  //        next()
  //      }
  //    })
  //  })
  //
  //  it('retrieve', function (next) {
  //    var url = _.result(options, 'url')
  //    request.get({
  //      url: url + '/' + created.id,
  //      json: {}
  //    }, function (err, res, body) {
  //      expect(err).to.be.not.defined
  //      expect(res.statusCode).to.equal(200, body)
  //      expect(body.id).to.equal(created.id)
  //      if (options.expects['retrieve']) {
  //        options.expects['retrieve'](body, next)
  //      } else {
  //        next()
  //      }
  //    })
  //  })
  //
  //  it('update valid', function (next) {
  //    var url = _.result(options, 'url')
  //    request.put({
  //      url: url + '/' + created.id,
  //      json: options.mocks['update-valid']()
  //    }, function (err, res, body) {
  //      expect(err).to.be.not.defined
  //      expect(res.statusCode).to.equal(200, body)
  //      if (options.expects['update-valid']) {
  //        options.expects['update-valid'](body, next)
  //      } else {
  //        next()
  //      }
  //    })
  //  })
  //
  //  it('update invalid', function (next) {
  //    var url = _.result(options, 'url')
  //    request.put({
  //      url: url + '/' + created.id,
  //      json: options.mocks['update-invalid']()
  //    }, function (err, res, body) {
  //      expect(err).to.be.not.defined
  //      expect(res.statusCode).to.equal(422, body)
  //      expect(body.errors).to.be.not.undefined
  //      if (options.expects['update-invalid']) {
  //        options.expects['update-invalid'](body, next)
  //      } else {
  //        next()
  //      }
  //    })
  //  })
  //
  //  it('delete', function (next) {
  //    var url = _.result(options, 'url')
  //    request.del({
  //      url: url + '/' + created.id,
  //      json: {}
  //    }, function (err, res, body) {
  //      expect(err).to.be.not.defined
  //      expect(res.statusCode).to.equal(200, body)
  //      if (options.expects['delete-valid']) {
  //        options.expects['delete-valid'](body, next)
  //      } else {
  //        next()
  //      }
  //    })
  //  })
  //
  //  next()
  //}
}


module.exports = function (helpers) {
  helpers.testCRUD = createTestCRUDFunction
}
