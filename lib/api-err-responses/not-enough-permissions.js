module.exports = function (reason) {
  reason = reason | 'not enough permissions'
  var err = new Error()
  err.body = {
    errors: {
      base: [reason]
    }
  }
  err.code = 401
  return err
}
