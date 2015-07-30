var express = require('express')
var router = express.Router()
var path = require('path')
var frontCfg = require('konphyg')(process.cwd() + '/config')('front-end')

require('./auth/jwt')(router)

router.get('/', function (req, res) {
  res.render('index', frontCfg.meta)
})

require('./users')(router)

module.exports = router


