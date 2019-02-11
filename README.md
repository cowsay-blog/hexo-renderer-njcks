# hexo-renderer-njcks
Yet another [Nunjucks](https://mozilla.github.io/nunjucks/) renderer for Hexo.

## Features 🎉
- Nunjucks 3
- Predefined filters
- Full Nunjucks renderer customization via Hexo Filter API

## Installation
```bash
npm install hexo-renderer-njcks
```

## Configuration
You can customize the Nunjucks renderer via the 2 following ways.

### Config files
All configs are passed directly to `Nunjucks#configure()`, available options can be found [here](https://mozilla.github.io/nunjucks/api.html#configure).

The following list shows the descending precedence of config files. (The first one presented is used.)
- Key `nunjucks` in `<hexo_root>/_config.yml`
- Key `theme_config.nunjucks` in `<hexo_root>/_config.yml`
- Key `nunjucks` in `<hexo_root>/themes/<theme_name>/_config.yml`
- [Inline default config](./index.js#L5)

### Hexo Filter API
You can extend the `before_render:nunjucks` filter whose first argument is an Nunjucks [Environment](https://mozilla.github.io/nunjucks/api.html#environment) object, which is used later to render templates.

> Note that the filter should be **synchronized**.

For example, you can use the following code in your Hexo script to add a new Nunjucks filter named `split` to split strings into arrays of strings.

```js
hexo.extend.filter.register('before_render:nunjucks', function SplitFilter (env) {
  env.addFilter('split', (str, del) => str.split(del))
})
```

In the template, use the Nunjucks filter as usual.
```
{% for i in "1 2 3 4 5"|split(' ') %}#{{ i }}{% endfor %}
```

Output should be
```
#1#2#3#4#5
```

## Built-in Filters
### `typeof`
Template
```
{{ "test" | typeof }}
```

Output
```
string
```

### `xmlattr`
Hexo script
```js
hexo.extend.filter.register('before_render:nunjucks', function GlobalStyleObj (env) {
  env.addGlobal('DEFAULT_STYLE', {
    someAttr: 'a',
    other: 'b'
  })
})
```

Template
```html
<div {{ DEFAULT_STYLE | xmlattr }}></div>
```

Output
```
<div some-attr="a" other="b"></div>
```