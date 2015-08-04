/* global it, expect */
var $require = require(process.cwd() + '/lib/require')
var _ = require('lodash')
var qs = require('querystring')
var moment = require('moment')
var buildCRUD = $require('lib/api-helpers/buildCRUD')
require('moment-objectid')()
var request = require('superagent')
var Promise = require('bluebird')

var defaults = {
  'create-valid': {
    data: {},
    expects: (err, res) => {
      var body = res.body
      expect(err).to.be.null
      expect(res.statusCode).to.equal(200)
      expect(body.errors).to.be.not.defined
    },
    after: (res, next)=> {
      currDoc = res.body
      next()
    }
  },
  'create-invalid': {
    data: {},
    expects: (err, res) => {
      var body = res.body
      expect(err).to.be.an('object')
      expect(res.statusCode).to.equal(422)
      expect(body.errors).to.be.not.undefined
    }
  },
  'patch-valid': {
    path: () => { return '/' + currDoc.id },
    data: {},
    expects: (err, res) => {
      expect(err).to.be.null
      expect(res.statusCode).to.equal(200)
    },
    before: (next) => {
      next()
    }
  },
  'patch-invalid': {
    path: () => { return '/' + currDoc.id },
    data: {},
    expects: (err, res) => {
      var body = res.body
      expect(err).to.be.not.defined
      expect(res.statusCode).to.equal(422)
      expect(body.errors).to.be.not.undefined
    }
  },
  'list': {
    header: () => { return _.result(currOptions['patch-valid'], 'header') },
    data: {},
    expects: (err, res) => {
      expect(err).to.be.not.defined
      var body = res.body
      expect(body.length).to.be.at.least(1)
    }
  },
  'list-paginated': {
    header: () => { return _.result(currOptions['patch-valid'], 'header') },
    path: () => { return '?' + qs.stringify(_.result(this, 'data')) },
    data: () => {
      var largerCursor = moment(currDoc.created).add(1, 'second').toObjectId()
      return {
        limit: 1,
        cursor: largerCursor
      }
    },
    expects: (err, res) => {
      expect(err).to.be.not.defined
      var body = res.body
      expect(body).to.be.an('object')
      expect(body.limit).to.equal(1)
      expect(body.cursor).to.be.defined
      expect(body.items).to.be.defined
      expect(body.items.length).to.equal(1)
      expect(body.total).to.equal(1)
    }
  },
  'list-paginated-no-cursor': {
    header: () => { return _.result(currOptions['patch-valid'], 'header') },
    path: () => { return '?' + qs.stringify({ limit: 1 }) },
    data: '',
    expects: (err, res) => {
      var body = res.body
      expect(err).to.be.not.defined
      expect(res.statusCode).to.equal(200)
      expect(body.total).to.equal(1)
      expect(body.limit).to.equal(1)
    }
  },
  'list-paginated-empty': {
    header: () => { return _.result(currOptions['patch-valid'], 'header') },
    path: () => {
      var smallerCursor = moment(currDoc.created).subtract(10, 'second').toObjectId()
      return '?' + qs.stringify({cursor: smallerCursor, limit: 1})
    },
    data: '',
    expects: (err, res) => {
      var body = res.body
      expect(err).to.be.not.defined
      expect(res.statusCode).to.equal(200)
      expect(body.total).to.equal(0)
      expect(body.limit).to.equal(1)
    }
  },
  'list-paginated-invalid': {
    header: () => { return _.result(currOptions['patch-valid'], 'header') },
    path: () => {
      var smallerCursor = moment(currDoc.created).subtract(10, 'second').toObjectId()
      return '?' + qs.stringify({ cursor: smallerCursor })
    },
    data: '',
    expects: (err, res) => {
      var body = res.body
      expect(err).to.be.not.defined
      expect(res.statusCode).to.equal(200)
      expect(body).to.be.an('array')
    }
  },
  'retrieve': {
    header: () => { return _.result(currOptions['patch-valid'], 'header') },
    path: () => { return '/' + currDoc.id },
    data: {},
    expects: (err, res) => {
      var body = res.body
      expect(err).to.be.not.defined
      expect(res.statusCode).to.equal(200)
      expect(body.id).to.equal(currDoc.id)
    }
  },
  'remove': {
    header: () => { return _.result(currOptions['patch-valid'], 'header') },
    path: () => { return '/' + currDoc.id },
    data: {},
    expects: (err, res) => {
      expect(err).to.be.not.defined
      expect(res.statusCode).to.equal(200)
    }
  }
}

var actions = _.keys(defaults)
var currDoc = null
var currOptions // var to store options fro call to have access to dynamic header e.g.

function extendDefaultsByOptions (options) {
  _.each(actions, (action) => {
    if (_.has(options, action)) {
      var opt = options[action]

      opt.path = defaults[action].path
      opt.data = opt.data

      opt.expects = [
        (defaults[action].expects || null),
        (opt.expects || null)
      ]

      opt.before = [
        defaults[action].before || null,
        opt.before || null
      ]

      opt.after = [
        defaults[action].after || null,
        opt.after || null
      ]
    } else {
      options[action] = defaults[action]
      options[action].expects = [defaults[action].expects]
      options[action].before = [defaults[action].before || null, null]
      options[action].after = [defaults[action].after || null, null]
    }
    // before we need to keep [value, value] even if value == null to check trough 2 promises
    // after can be flattened
    _.remove(options[action].after, (item) => { return !_.isFunction(item) })
  })
  return options
}

function processFn (fn) {
  var deferred = Promise.defer()

  if (_.isFunction(fn)) {
    process.nextTick(() => {
      fn((res) => { deferred.resolve(res) })
    })
  } else {
    deferred.resolve(null)
  }

  return deferred.promise
}

// should be used only in describe block
function createTestCRUDFunction (baseUrl, options) {
  return function () {
    currOptions = options = extendDefaultsByOptions(options)

    _.each(options, (opt, action) => {
      var route = buildCRUD.actionsMapping[action.split('-').shift()]
      var method = route.split(' ').shift().toLowerCase()
      method = method === 'delete' ? 'del' : method

      it(action, (next) => {
        var actionUrl = baseUrl + (_.result(opt, 'path') || '')

        processFn(opt.before[0])
        .then(() => { return processFn(opt.before[1]) })
        .then((res)=> {
          var header = _.result(opt, 'header') || {}

          if (res) {
            if (_.has(res, 'header')) {
              header = _.extend(header, res.header)
            }
          }

          var afterCb = _.after(opt.after.length, () => {
            next()
          })

          request[method](actionUrl)
            .set(header)
            .send(opt.data)
            .end((err, res) => {
              _.each(opt.expects, (fn) => {
                _.isFunction(fn) && fn(err, res)
              })

              if (opt.after.length === 0) { return next() }
              _.each(opt.after, (fn) => { fn(res, afterCb) })
            })
        })
      })
    })
  }
}

module.exports = function (helpers) {
  helpers.testCRUD = createTestCRUDFunction
}
