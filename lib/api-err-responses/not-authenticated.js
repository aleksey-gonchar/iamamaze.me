module.exports = function () {
  var err = new Error('Not authenticated')
  err.body = {
    errors: {
      base: ['not authenticated']
    }
  }
  err.code = 401
  return err
}
