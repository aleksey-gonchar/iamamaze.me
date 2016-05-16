module.exports = (req, res, next) => {
  res.status(200)
  res.body = req.user.toJSON()
  res.body.token = req.getToken(res.body)
  next()
}
