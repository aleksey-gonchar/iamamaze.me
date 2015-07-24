process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var bootstrapMongo = require('./lib/initializers/mongo')
var bootstrapExpress = require('./lib/initializers/express')

if (process.env.NODE_ENV === 'development') {
  require('longjohn')
}

bootstrapMongo()
  .then(bootstrapExpress)
  .done()