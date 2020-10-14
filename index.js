const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const rimraf = require('rimraf')
const cwd = process.cwd()
const bytenode = require('bytenode')
const assert = require('assert')


class Builder {
    constructor({ src, dist, ignore = [] }) {
        this.src = src || 'src'
        this.dist = dist || 'dist'
        this.source = path.join(cwd, this.src)
        this.target = path.join(cwd, this.dist)

        this.searchOptions = {
            cwd: this.target,
            realpath: true,
            ignore: ['node_modules/**', ...ignore],
        }
    }

    start() {
        this.log()
        this.log('build start')
        this.clone()
        this.compile()
    }

    clone() {
        assert.ok(fs.pathExistsSync(this.source), 'src must exist')

        if (fs.pathExistsSync(this.target)) {
            this.log('remove', this.dist)
            rimraf.sync(this.target)
        }

        this.log('clone', this.src, 'to', this.dist)
        fs.copySync(this.source, this.target)
    }

    search() {
        return glob.sync('**/*.js', this.searchOptions)
    }

    compile() {
        this.search().map(file => {
            this.log('compile:', path.relative(cwd, file))
            bytenode.compileFile(file)
            fs.removeSync(file)
        })
        this.log('compile done')
    }

    log() {
        console.log('  ', ...arguments)
    }

    static start(options) {
        (new Builder(options)).start()
    }
}

module.exports = (options) => {
    options = options || { ignore: [] }
    Builder.start(options)
}
