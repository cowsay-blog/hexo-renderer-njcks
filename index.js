const nunjucks = require('nunjucks')
const path = require('path')

const nunjucksDefaults = {
  autoescape: false,
  watch: false
}

const CONFIG = Object.assign({}, nunjucksDefaults, hexo.config.nunjucks)

const builtInFilters = [
  require('./filters/cast-array'),
  require('./filters/base-url'),
  require('./filters/prop'),
  require('./filters/typeOf')
]
  .map(filter => ({
    name: toSnakeCase(filter.name),
    handler: filter,
    async: filter.async
  }))

hexo.log.info('[nunjucks-extra] Filters: %s', builtInFilters.map(filter => filter.name).join(', '))

function toSnakeCase (str = '') {
  return str.replace(/[A-Z]/g, (matched) => '_' + matched.toLowerCase())
}

function installFilters (env, filter) {
  env.addFilter(toSnakeCase(filter.name), filter.handler, filter.async)
}

function njkCompile (data) {
  const templateDir = path.dirname(data.path)
  const env = nunjucks.configure(templateDir, CONFIG)
  builtInFilters.forEach(filter => installFilters(env, filter))
  const njkTemplate = nunjucks.compile(data.text, env)
  return function renderer (locals, cb) {
    return njkTemplate.render(locals, cb)
  }
}

function njkRenderer (data, locals, cb) {
  return njkCompile(data)(locals, cb)
}

njkRenderer.compile = njkCompile

/* global hexo */
hexo.extend.renderer.register('j2', 'html', njkRenderer, false)
hexo.extend.renderer.register('njk', 'html', njkRenderer, false)
hexo.extend.renderer.register('nunjucks', 'html', njkRenderer, false)
