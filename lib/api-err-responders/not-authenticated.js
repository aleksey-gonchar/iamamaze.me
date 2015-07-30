module.exports = function (reason) {
  reason = reason || 'not authenticated'
  var err = new Error(reason)
  err.name = 'Not authenticated'
  err.code = 401
  return err
}
