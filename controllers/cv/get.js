var _ = require('lodash')

module.exports = _.curry((data, req, res, next) => {
  res.status(200)
  res.body = data
  next()
})
