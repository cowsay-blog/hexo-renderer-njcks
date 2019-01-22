const url = require('url')

module.exports = function baseUrl (to, from) {
  console.log
  return new url.URL(to, from)
}
