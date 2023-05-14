const { default: MpaPlugin } = require('rspack-plugin-mpa')

const isProd = process.env.NODE_ENV === 'production'

/**
 * @type {import('@rspack/cli').Configuration}
 */
const config = {
    mode: isProd ? 'production' : 'development',
    output: {
        clean: true,
        path: './dist',
    },
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

module.exports = config
