# rspack-plugin-mpa

## Install

```bash
pnpm install rspack-plugin-mpa
```

## Usage

[Example](./example/rspack.config.js)

```javascript
const { default: MpaPlugin } = require('rspack-plugin-mpa')

module.exports = {
  // ...
  plugins: [
        new MpaPlugin({
            pages: {
                app1: {
                    entry: './src/app/app1/main',
                    title: 'Rspack Plugin Mpa',
                    minify:true
                },
                app2: {
                    entry: './src/app/app2/main',
                    title: 'Rspack Plugin Mpa',
                    minify:true
                }
            }
        })
    ]
}
```

## Config

For more configurations, please refer to [@rspack/plugin-html](https://github.com/web-infra-dev/rspack/blob/main/packages/rspack-plugin-html/README.md)
