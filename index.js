const { name } = require('./package.json')
const nunjucks = require('nunjucks')
const path = require('path')

const nunjucksDefaults = {
  autoescape: false,
  watch: false
}

const CONFIG = Object.assign({}, nunjucksDefaults, hexo.config.nunjucks)

const builtInFilters = [
  require('./filters/castarray'),
  require('./filters/baseurl'),
  require('./filters/prop'),
  require('./filters/typeof'),
  require('./filters/xmlattr')
]
  .map(filter => ({
    name: toSnakeCase(filter.name),
    handler: filter,
    async: filter.async
  }))

hexo.log.info('[%s] %d filters loaded', name, builtInFilters.length)

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
  return function renderer (locals) {
    return new Promise((resolve, reject) => {
      njkTemplate.render(locals, (err, result) => {
        if (err) {
          hexo.log.error(err)
          return reject(err)
        }
        resolve(result)
      })
    })
  }
}

function njkRenderer (data, locals) {
  return njkCompile(data)(locals)
}

njkRenderer.compile = njkCompile

hexo.extend.renderer.register('j2', 'html', njkRenderer, false)
hexo.extend.renderer.register('njk', 'html', njkRenderer, false)
hexo.extend.renderer.register('nunjucks', 'html', njkRenderer, false)
