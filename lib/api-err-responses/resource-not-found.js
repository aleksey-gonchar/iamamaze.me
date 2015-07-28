module.exports = function (id, resourceName) {
  id = id || ''
  resourceName = resourceName + ':' || ''
  var err = new Error()
  err.body = {
    errors: {
      base: ['resource [' + resourceName + id + '] not found']
    }
  }
  err.code = 404
  return err
}
