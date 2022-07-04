// wdio.safari.conf.js

/*
This runs tests against Safari on macOS.
*/

const merge = require('deepmerge');
const config = {};
config.default = require('./wdio.conf.js').config;

// insert modified configuration inside
config.override = {
    debug: false,
    execArgv: [],
    host: 'localhost',
    headers: {
        'authorization': 'Bearer abcde'
    },
    port: 4444,
    path: '/',
    automationProtocol: 'webdriver',
    capabilities: [{
        maxInstances: 1,
        browserName: 'safari'
    }],
    logLevel: 'info',
    services: [] //, 'eslinter', [require('./services/wdio-allure-environment-service')]],
};

// overwrite any arrays in default with arrays in override.
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

// have main config file as default but overwrite environment specific information
exports.config = merge(config.default, config.override, { arrayMerge: overwriteMerge, clone: false });
