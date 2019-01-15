const url = require('url')

module.exports = function baseUrl (to, from) {
  return new url.URL(to, from)
}
