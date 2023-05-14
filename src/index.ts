import type { Compiler, Entry, DevServer, EntryDescriptionNormalized, RspackPluginInstance } from '@rspack/core'
import type { Options as PluginHtmlOptions } from '@rspack/plugin-html'
import fs from 'fs'
import path from 'path'
import PluginHtml from '@rspack/plugin-html'

export interface Page extends PluginHtmlOptions {
    entry: Entry
}

export interface Options {
    pages: {
        [name: string]: Page
    }
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] };
type HistoryApiFallback =Exclude<DevServer['historyApiFallback'], null|undefined|boolean>;
type Rewrites = Mutable<NonNullable<HistoryApiFallback>['rewrites']>;

function normalizePageConfig(c: Page) {
    return typeof c === 'string' ? { entry: c } : c
}

function normalizeEntry(entry: Entry): EntryDescriptionNormalized {
    if (typeof entry === 'string') {
        return { import: [entry] }
    }
    if(Array.isArray(entry)) {
        return { import: entry }
    }
    return entry
}

function getDefaultTemplate(): string {
    const defaultTemplate1 = path.resolve(process.cwd(), 'public/index.html')
    const defaultTemplate2 = path.resolve(process.cwd(), 'index.html')
    if(fs.existsSync(defaultTemplate1)) {
        return defaultTemplate1
    }
    if(fs.existsSync(defaultTemplate2)) {
        return defaultTemplate2
    }
    return ''
}

class PluginMpa implements RspackPluginInstance {
    name = 'RspackPluginMpa'

    options: Options

    constructor(options: Options) {
        this.options = options
    }

    apply(compiler: Compiler) {
        const pages = Object.keys(this.options.pages || {})
        const rewrites: Rewrites = []

        // Temp
        delete compiler.options.entry.main

        pages.forEach(name => {
            const page = {
                template: getDefaultTemplate(),
                filename: `${name}.html`,
                ...normalizePageConfig(this.options.pages[name])
            }

            rewrites.push({
                from: new RegExp(`^/${name}$`),
                to: path.posix.join('/', typeof page.filename === 'function' ? page.filename(name) : page.filename)
            })

            compiler.options.plugins.push(new PluginHtml(page))
            compiler.options.entry[name] = normalizeEntry(page.entry)
        })

        const historyApiFallback = (compiler.options.devServer?.historyApiFallback || {}) as HistoryApiFallback
        compiler.options.devServer = {
            ...(compiler.options.devServer || {})
        }
        compiler.options.devServer.historyApiFallback = {
            ...(historyApiFallback || {}),
            rewrites: (historyApiFallback.rewrites || []).concat(rewrites)
        }
    }
}

export default PluginMpa
