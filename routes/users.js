var requireTree = require('require-tree')
var usersCtrl = requireTree('../controllers/users')
var apiHelpers = requireTree('../lib/api-helpers')

module.exports = function (router) {
  router.get('/users/current',
    apiHelpers.allowLogged,
    usersCtrl.current
  )
}