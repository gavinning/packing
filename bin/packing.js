#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const package = path.join(__dirname, '../package.json')
const app = require('../index')


program
    .version(require(package).version, '-v, --version')
    .description('packing nodejs by bytenode')
    .option('-s, --src <src>', 'source folder', 'src')
    .option('-d, --dist <dist>', 'target folder', 'dist')
    .option('-i, --ignore <ignores...>', 'ignore files')
    .action((...args) => app(...args))
    .parse(process.argv)
