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
      currDoc = res.body
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
  //'list': {
  //  data: {},
  //  expects: (err, res) => {
  //    expect(err).to.be.not.defined
  //    var body = res.body
  //    expect(body.length).to.be.at.least(1)
  //  }
  //},
  //'list-paginated': {
  //  path: () => { return '?' + qs.stringify(_.result(this, 'data')) },
  //  data: () => {
  //    var largerCursor = moment(currDoc.created).add(1, 'second').toObjectId()
  //    return {
  //      limit: 1,
  //      cursor: largerCursor
  //    }
  //  },
  //  expects: (err, res) => {
  //    expect(err).to.be.not.defined
  //    var body = res.body
  //    expect(body).to.be.an('object')
  //    expect(body.limit).to.equal(1)
  //    expect(body.cursor).to.be.defined
  //    expect(body.items).to.be.defined
  //    expect(body.items.length).to.equal(1)
  //    expect(body.total).to.equal(1)
  //  }
  //},
  //'list-paginated-no-cursor': {
  //  path: () => { return '?' + qs.stringify({ limit: 1 }) },
  //  data: '',
  //  expects: (err, res) => {
  //    var body = res.body
  //    expect(err).to.be.not.defined
  //    expect(res.statusCode).to.equal(200)
  //    expect(body.total).to.equal(1)
  //    expect(body.limit).to.equal(1)
  //  }
  //},
  //'list-paginated-empty': {
  //  path: () => {
  //    var smallerCursor = moment(currDoc.created).subtract(10, 'second').toObjectId()
  //    return '?' + qs.stringify({cursor: smallerCursor, limit: 1})
  //  },
  //  data: '',
  //  expects: (err, res) => {
  //    var body = res.body
  //    expect(err).to.be.not.defined
  //    expect(res.statusCode).to.equal(200)
  //    expect(body.total).to.equal(0)
  //    expect(body.limit).to.equal(1)
  //  }
  //},
  //'list-paginated-invalid': {
  //  path: () => {
  //    var smallerCursor = moment(currDoc.created).subtract(10, 'second').toObjectId()
  //    return '?' + qs.stringify({ cursor: smallerCursor })
  //  },
  //  data: '',
  //  expects: (err, res) => {
  //    var body = res.body
  //    expect(err).to.be.not.defined
  //    expect(res.statusCode).to.equal(200)
  //    expect(body).to.be.an('array')
  //  }
  //},
  //'retrieve': {
  //  path: () => { return '/' + currDoc.id },
  //  data: {},
  //  expects: (err, res) => {
  //    var body = res.body
  //    expect(err).to.be.not.defined
  //    expect(res.statusCode).to.equal(200)
  //    expect(body.id).to.equal(currDoc.id)
  //  }
  //},
  //'remove': {
  //  path: () => { return '/' + currDoc.id },
  //  data: {},
  //  expects: (err, res) => {
  //    expect(err).to.be.not.defined
  //    expect(res.statusCode).to.equal(200)
  //  }
  //}
}

var actions = _.keys(defaults)
var currDoc = null

function extendDefaultsByOptions (options) {
  _.each(actions, (action) => {
    if (_.has(options, action)) {
      if (_.isFunction(options[action].expects)) {
        options[action].expects = [options[action].expects]
      }
      if (_.isFunction(defaults[action].expects)) {
        options[action].expects = [defaults[action].expects]
      }
      options[action].path = defaults[action].path
      options[action].data = options[action].data
      options[action].before = options[action].before
      options[action].after = options[action].after
    } else {
      options[action] = defaults[action]
    }
  })

  return options
}

// should be used only in describe block
function createTestCRUDFunction (baseUrl, options) {
  return function () {
    options = extendDefaultsByOptions(options)

    _.each(options, (opt, action) => {
      var route = buildCRUD.actionsMapping[action.split('-').shift()]
      var method = route.split(' ').shift().toLowerCase()
      method = method === 'delete' ? 'del' : method

      it(action, (next) => {
        var actionUrl = baseUrl + (_.result(opt, 'path') || '')

        new Promise((resolve, reject) => {
          if (_.isFunction(opt.before)) {
            process.nextTick( () => {
              opt.before( (res) => { resolve(res) } )
            })
          } else {
            resolve(null)
          }
        })
        .then((res)=> {
          var header = _.result(opt, 'header') || {}

          if (res) {
            if (_.has(res, 'header')) {
              header = _.extend(header, res.header)
            }
          }

          request[method](actionUrl)
            .set(header)
            .send(opt.data)
            .end((err, res) => {
              if (_.isArray(opt.expects)) {
                _.each(opt.expects, (item) => { item(err, res) })
              }
              if (_.isFunction(opt.expects)) { opt.expects(err, res) }
              if (_.isFunction(opt.after)) {
                opt.after(res, () => { next() })
              } else {
                next()
              }
            })
        })
      })
    })
  }
}

module.exports = function (helpers) {
  helpers.testCRUD = createTestCRUDFunction
}
