module.exports = function current(req, res, next) {
  res.body = req.user.toJSON()
  res.body.token = req.getToken(res.body)
  next()
}
