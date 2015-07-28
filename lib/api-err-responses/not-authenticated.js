module.exports = function () {
  var err = new Error()
  err.body = {
    errors: {
      base: ['not authenticated']
    }
  }
  err.code = 401
  return err
}
