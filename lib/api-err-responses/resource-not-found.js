module.exports = function (id, resourceName) {
  id = id || ''
  resourceName = resourceName + ':' || ''

  var err = new Error('resource [' + resourceName + id + '] not found')
  err.code = 404
  err.name = 'Not found'

  return err
}
