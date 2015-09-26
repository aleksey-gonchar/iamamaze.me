var _ = require('lodash')

module.exports = _.curry((data, req, res, next) => {
  res.body = data
  next()
})
