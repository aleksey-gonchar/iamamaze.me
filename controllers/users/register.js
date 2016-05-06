var User = require('../../models/user')

module.exports = (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err)
    res.status(200)
    res.body = user.toJSON()
    next()
  })
}
