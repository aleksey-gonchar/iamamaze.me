module.exports = (req, res, next) => {
  res.status(200)
  req.session.userId = null
  res.body = {success: true}
  next()
}
