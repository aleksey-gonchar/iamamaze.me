if (process.env.NODE_ENV === 'development') {
  module.exports = require('./Root.development')
} else {
  module.exports = require('./Root.production')
}
