module.exports = function castArray (arg) {
  return Array.isArray(arg) ? arg : [ arg ]
}

// module.exports.async = false
