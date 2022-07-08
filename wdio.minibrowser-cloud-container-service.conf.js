// wdio.minibrowser-cloud-container-service.conf.js 

/*
 - This configuration runs in Google Cloud Run, and headfully, meaning not headless.
 - It runs against a container running WebKitGTK browsers.

 From the WebdriverIO docs:
 $ CLOUD_CONTAINER_APP_URL=<your_cloud_container_url> CLOUD_CONTAINER_ACCESS_TOKEN=<token> npx wdio wdio.minibrowser-cloud-container-service.conf.js

*/


const merge = require('deepmerge');
const config = {};
config.default = require('./wdio.conf.js').config;

const ARCH = process.env.CLOUD_CONTAINER_ARCH === undefined
    ? 'x86_64' 
    : process.env.CLOUD_CONTAINER_ARCH;

// insert modified configuration inside
config.override = {
    debug: false,
    execArgv: [],
    port: 443,
    protocol: 'https',
    hostname: process.env.CLOUD_CONTAINER_APP_URL,
    headers: {
        'authorization': 'Bearer ' + process.env.CLOUD_CONTAINER_ACCESS_TOKEN
    },
    strictSSL: true,
    services: [['cloud-container', {
        maxAttempts: 12,
        retryTimeout: 6000
    }]],
    path: '/',
    automationProtocol: 'webdriver',
    capabilities: [{
        maxInstances: 1,
        browserName: 'MiniBrowser',
        'webkitgtk:browserOptions': {
            args: [
                '--automation'
            ],
            binary: `/usr/lib/${ARCH}-linux-gnu/webkit2gtk-4.0/MiniBrowser`
        }
    }],
    logLevel: 'info'
};

// overwrite any arrays in default with arrays in override.
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

// have main config file as default but overwrite environment specific information
exports.config = merge(config.default, config.override, { arrayMerge: overwriteMerge, clone: false });

