var $require = require(process.cwd() + '/lib/require')
var requireTree = require('require-tree')
var usersCtrl = requireTree('../controllers/users')
var apiHelpers = requireTree('../lib/api-helpers')

var User = $require('models/user')

module.exports = function (router) {
  router.post('/users/login', usersCtrl.login)
  router.get('/users/current', [ apiHelpers.allowLogged, usersCtrl.current ])

  router.use('/users', apiHelpers.crud(User, {
    actions: {
      update: false
    }
  }))
}