module.exports = function prop (obj, name) {
  return typeof obj === 'object' && obj ? obj[name] : obj
}
