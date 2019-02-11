const nunjucks = require('nunjucks')
const path = require('path')

const nunjucksDefaults = {
  autoescape: false,
  watch: false
}

const builtInFilters = [
  require('./filters/typeof'),
  require('./filters/xmlattr')
]
  .map(filter => typeof filter === 'function' ? ({
    name: toSnakeCase(filter.name),
    handler: filter,
    async: filter.async
  }) : ({
    name: toSnakeCase(filter.name || filter.fn.name),
    handler: filter.fn,
    async: filter.async
  }))

function toSnakeCase (str = '') {
  return str.replace(/[A-Z]/g, (matched) => '_' + matched.toLowerCase())
}

function installFilters (env, filter) {
  env.addFilter(toSnakeCase(filter.name), filter.handler, filter.async)
}

function safeGet (getter = () => ({}), defaultVal) {
  try {
    return getter()
  } catch (e) {
    return defaultVal
  }
}

function njkCompile (data) {
  const CONFIG = Object.assign(
    {},
    nunjucksDefaults,
    safeGet(() => hexo.theme.config.nunjucks),
    safeGet(() => hexo.config.theme_config.nunjucks),
    safeGet(() => hexo.config.nunjucks)
  )

  const templateDir = path.dirname(data.path)
  let env = nunjucks.configure(templateDir, CONFIG)
  builtInFilters.forEach(filter => installFilters(env, filter))

  env = hexo.execFilterSync('before_render:nunjucks', env, {
    context: env
  })

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
