var $require = require(process.cwd() + '/lib/require')
var User = $require('models/user')
var errResNotFound = require('../api-err-responses/resource-not-found')
var errResNotAuthenticated = require('../api-err-responses/not-authenticated')

module.exports = function (req, res, next) {
  if (!req.session.userId) {
    return next(errResNotAuthenticated())
  }

  if (!req.user) {
    User.findById(req.session.userId, function (err, user) {
      if (err) return next(err)
      if (!user) return next(errResNotFound(req.session.userId, 'User'))
      req.user = user
      next()
    })
  } else {
    next()
  }
}
