var express = require('express')
var router = express.Router()
var path = require('path')
var frontCfg = require('konphyg')(process.cwd() + '/config')('front-end')


router.get('/', function (req, res) {
  res.render('index', frontCfg.meta)
})

module.exports = router


