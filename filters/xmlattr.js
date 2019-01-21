function toKebabCase (str = '') {
  return str.replace(/[A-Z]/g, (matched) => '-' + matched.toLowerCase())
}

function escapeDoubleQuote (str) {
  return `${str}`.replace(/"/g, '\\"')
}

module.exports = function xmlattr (obj) {
  return Object.keys(obj).map(k => `${toKebabCase(k)}="${escapeDoubleQuote(obj[k])}"`).join(' ')
}
